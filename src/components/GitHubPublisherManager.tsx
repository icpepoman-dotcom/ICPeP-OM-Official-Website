import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import {
  GitBranch,
  Github,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Copy,
  ExternalLink,
  RefreshCw,
  Clock,
  Send,
  Lock,
  Eye,
  EyeOff,
  Terminal,
  ShieldCheck,
  Check,
  FolderGit2,
  BookOpen,
  HelpCircle,
  Download,
  Share2,
} from 'lucide-react';

interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  filePath: string;
  workflowDispatch: boolean;
}

interface PublishHistoryItem {
  id: string;
  timestamp: string;
  author: string;
  commitMessage: string;
  commitSha?: string;
  commitUrl?: string;
  repo: string;
  branch: string;
  status: 'success' | 'failed';
  errorDetails?: string;
  filesUpdated: string[];
}

const GITHUB_CONFIG_KEY = 'icpep_oman_github_config_v1';
const GITHUB_HISTORY_KEY = 'icpep_oman_github_history_v1';

export const GitHubPublisherManager: React.FC = () => {
  const { content, currentUser, logAccessEvent, lastSaved, exportJson } = useContent();

  // Configuration state
  const [config, setConfig] = useState<GitHubConfig>(() => {
    try {
      const saved = localStorage.getItem(GITHUB_CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse GitHub config:', e);
    }
    return {
      owner: 'icpep-oman',
      repo: 'icpep-oman-portal',
      branch: 'main',
      token: '',
      filePath: 'src/data/content.json',
      workflowDispatch: true,
    };
  });

  const [history, setHistory] = useState<PublishHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(GITHUB_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse GitHub history:', e);
    }
    return [
      {
        id: 'PUB-DEMO-01',
        timestamp: 'October 15, 2026, 02:45 PM',
        author: 'Engr. Michael Ray C. Del Rosario',
        commitMessage: 'chore(content): update 2026 General Assembly dates and CPD credits',
        commitSha: '8f3a91b',
        commitUrl: 'https://github.com/icpep-oman/icpep-oman-portal/commit/8f3a91b',
        repo: 'icpep-oman/icpep-oman-portal',
        branch: 'main',
        status: 'success',
        filesUpdated: ['src/data/content.json'],
      },
    ];
  });

  // UI state
  const [showToken, setShowToken] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState(
    `Update website content: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  );
  const [publishFeedback, setPublishFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    description: string;
    url?: string;
  } | null>(null);

  const [activeSubTab, setActiveSubTab] = useState<'publish' | 'settings' | 'history' | 'quick-guide'>('publish');
  const [copiedCode, setCopiedCode] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Save config to local storage
  const handleSaveConfig = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(config));
      setSaveStatus('GitHub repository configuration saved successfully.');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Verify connection to GitHub repo
  const handleTestConnection = async () => {
    if (!config.owner.trim() || !config.repo.trim()) {
      setVerificationStatus('invalid');
      setVerificationError('Owner/Organization and Repository name are required.');
      return;
    }

    setVerificationStatus('checking');
    setVerificationError(null);

    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };
      if (config.token.trim()) {
        headers.Authorization = `Bearer ${config.token.trim()}`;
      }

      const res = await fetch(`https://api.github.com/repos/${config.owner.trim()}/${config.repo.trim()}`, {
        headers,
      });

      if (res.ok) {
        const repoData = await res.json();
        setVerificationStatus('valid');
        setVerificationError(null);
      } else {
        const errData = await res.json().catch(() => ({}));
        setVerificationStatus('invalid');
        setVerificationError(
          errData.message || `GitHub returned status ${res.status}. Check repo name, permissions, or token.`
        );
      }
    } catch (err: any) {
      setVerificationStatus('invalid');
      setVerificationError(err?.message || 'Network error verifying GitHub connection.');
    }
  };

  // Publish changes to GitHub via GitHub REST API (Create or Update File Contents)
  const handlePublishToGitHub = async () => {
    if (!config.owner.trim() || !config.repo.trim()) {
      setPublishFeedback({
        type: 'error',
        title: 'Missing Repository Information',
        description: 'Please specify the GitHub Owner/Organization and Repository Name in the settings tab.',
      });
      return;
    }

    if (!config.token.trim()) {
      setPublishFeedback({
        type: 'error',
        title: 'Personal Access Token Required',
        description:
          'A GitHub Personal Access Token (PAT with "repo" or "contents:write" permission) is required to push directly. Enter your token in the "Repository Configuration" tab.',
      });
      setActiveSubTab('settings');
      return;
    }

    setIsPublishing(true);
    setPublishFeedback(null);

    const targetBranch = config.branch.trim() || 'main';
    const filePath = config.filePath.trim() || 'src/data/content.json';
    const authorName = currentUser?.name || 'ICpEP-Oman Secretariat';
    const authorEmail = currentUser?.email || 'icpep.oman@gmail.com';
    const commitMsg = publishMessage.trim() || `Update website content via ICpEP Admin Desk (${new Date().toISOString()})`;

    try {
      // 1. Prepare JSON string
      const fileContentString = JSON.stringify(content, null, 2);
      // UTF-8 base64 encoding safe for unicode characters
      const encodedContent = btoa(unescape(encodeURIComponent(fileContentString)));

      // 2. Fetch existing file to get SHA (if already exists)
      let fileSha: string | undefined = undefined;
      const getFileUrl = `https://api.github.com/repos/${config.owner.trim()}/${config.repo.trim()}/contents/${filePath}?ref=${targetBranch}`;

      const getRes = await fetch(getFileUrl, {
        headers: {
          Authorization: `Bearer ${config.token.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (getRes.ok) {
        const existingData = await getRes.json();
        fileSha = existingData.sha;
      }

      // 3. Put / Update File Contents
      const putFileUrl = `https://api.github.com/repos/${config.owner.trim()}/${config.repo.trim()}/contents/${filePath}`;
      const putPayload: any = {
        message: commitMsg,
        content: encodedContent,
        branch: targetBranch,
        committer: {
          name: authorName,
          email: authorEmail,
        },
      };
      if (fileSha) {
        putPayload.sha = fileSha;
      }

      const putRes = await fetch(putFileUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${config.token.trim()}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(putPayload),
      });

      if (!putRes.ok) {
        const errorJson = await putRes.json().catch(() => ({}));
        throw new Error(errorJson.message || `GitHub returned ${putRes.status}: ${putRes.statusText}`);
      }

      const commitResult = await putRes.json();
      const commitSha = commitResult?.commit?.sha || commitResult?.content?.sha || 'unknown';
      const shortSha = commitSha.slice(0, 7);
      const commitUrl = `https://github.com/${config.owner.trim()}/${config.repo.trim()}/commit/${commitSha}`;

      // 4. Record History Entry
      const newHistoryItem: PublishHistoryItem = {
        id: `PUB-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        author: authorName,
        commitMessage: commitMsg,
        commitSha: shortSha,
        commitUrl,
        repo: `${config.owner.trim()}/${config.repo.trim()}`,
        branch: targetBranch,
        status: 'success',
        filesUpdated: [filePath],
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 24)];
      setHistory(updatedHistory);
      try {
        localStorage.setItem(GITHUB_HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch (e) {}

      // 5. Log Security Event
      logAccessEvent(
        'GITHUB_PUBLISHED',
        authorEmail,
        authorName,
        `Published updates to GitHub repository ${config.owner}/${config.repo} (Branch: ${targetBranch}, Commit: ${shortSha}).`,
        'info'
      );

      setPublishFeedback({
        type: 'success',
        title: 'Successfully Published to GitHub!',
        description: `Commit "${shortSha}" successfully pushed to ${config.owner}/${config.repo} on branch "${targetBranch}". GitHub Actions or Pages deployment will pick up these changes automatically.`,
        url: commitUrl,
      });
    } catch (err: any) {
      console.error('Publish to GitHub failed:', err);

      const failedHistoryItem: PublishHistoryItem = {
        id: `PUB-ERR-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        author: authorName,
        commitMessage: commitMsg,
        repo: `${config.owner.trim()}/${config.repo.trim()}`,
        branch: targetBranch,
        status: 'failed',
        errorDetails: err?.message || 'Unknown network error',
        filesUpdated: [filePath],
      };

      setHistory((prev) => [failedHistoryItem, ...prev.slice(0, 24)]);

      setPublishFeedback({
        type: 'error',
        title: 'Publish Operation Failed',
        description: err?.message || 'Could not commit modifications to GitHub. Verify your token permissions and branch protection rules.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Generate content file for manual git commit / download
  const handleDownloadContentJson = () => {
    const jsonStr = JSON.stringify(content, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = config.filePath.split('/').pop() || 'content.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleCopyGitCommands = () => {
    const commands = `# 1. Save downloaded content file into your repository
cp ~/Downloads/content.json ${config.filePath}

# 2. Review diff
git status
git diff ${config.filePath}

# 3. Commit and push modifications
git add ${config.filePath}
git commit -m "${publishMessage.replace(/"/g, '\\"')}"
git push origin ${config.branch}`;

    navigator.clipboard.writeText(commands);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="border-b border-[#CDCDC0] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-wider">
              Continuous Delivery & Source Control
            </span>
            <span className="px-2 py-0.5 bg-[#12203A] text-[#C99A2E] text-[10px] font-mono font-bold uppercase">
              Git v2.4 / GitHub API
            </span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#12203A] flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-[#12203A]" />
            <span>Save, Upload & Publish Modifications to GitHub</span>
          </h3>
          <p className="text-xs text-[#6A778D] font-mono mt-0.5">
            Synchronize live website copy, officers, announcements, and configurations directly with your official GitHub repository.
          </p>
        </div>

        {/* Current Target Repo Badge */}
        <div className="flex items-center gap-3 bg-white border border-[#CDCDC0] p-2.5 shadow-xs">
          <Github className="w-7 h-7 text-[#12203A] shrink-0" />
          <div className="font-mono text-xs">
            <div className="text-[10px] uppercase text-[#6A778D] font-bold">Target Repository</div>
            <div className="font-bold text-[#12203A] flex items-center gap-1.5">
              <span>{config.owner}/{config.repo}</span>
              <span className="px-1.5 py-0.2 bg-[#EEEEE7] text-[#12203A] text-[9px] border border-[#CDCDC0]">
                {config.branch}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#CDCDC0] p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#6A778D] uppercase">Live Staged Content</div>
            <div className="font-serif text-2xl font-bold text-[#12203A]">Ready</div>
            <div className="font-mono text-[10px] text-[#2E7D32]">
              {lastSaved ? `Saved ${lastSaved}` : 'Up to Date'}
            </div>
          </div>
          <div className="p-2 bg-[#EEEEE7] text-[#12203A]">
            <FileCode className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#CDCDC0] p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#6A778D] uppercase">Target Branch</div>
            <div className="font-serif text-2xl font-bold text-[#12203A]">{config.branch}</div>
            <div className="font-mono text-[10px] text-[#6A778D]">Production Tracking</div>
          </div>
          <div className="p-2 bg-[#EEEEE7] text-[#12203A]">
            <GitBranch className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#CDCDC0] p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#6A778D] uppercase">Publish History</div>
            <div className="font-serif text-2xl font-bold text-[#12203A]">{history.length}</div>
            <div className="font-mono text-[10px] text-[#2E7D32]">
              {history.filter((h) => h.status === 'success').length} Deployed
            </div>
          </div>
          <div className="p-2 bg-[#EEEEE7] text-[#2E7D32]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#CDCDC0] p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#6A778D] uppercase">PAT Token Status</div>
            <div className="font-serif text-xl font-bold text-[#12203A]">
              {config.token.trim() ? 'Configured' : 'Missing'}
            </div>
            <div className={`font-mono text-[10px] ${config.token.trim() ? 'text-[#2E7D32]' : 'text-[#9C3B2E]'}`}>
              {config.token.trim() ? 'Direct Push Enabled' : 'PAT Required for Push'}
            </div>
          </div>
          <div className="p-2 bg-[#EEEEE7] text-[#12203A]">
            <Lock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#CDCDC0] pb-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('publish')}
            className={`px-3 py-1.5 font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'publish'
                ? 'bg-[#12203A] text-[#EEEEE7] border border-[#12203A]'
                : 'bg-white text-[#12203A] border border-[#CDCDC0] hover:bg-[#EEEEE7]'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#C99A2E]" />
            <span>Publish Modifications</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('settings')}
            className={`px-3 py-1.5 font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'settings'
                ? 'bg-[#12203A] text-[#EEEEE7] border border-[#12203A]'
                : 'bg-white text-[#12203A] border border-[#CDCDC0] hover:bg-[#EEEEE7]'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>Repository Configuration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-[#12203A] text-[#EEEEE7] border border-[#12203A]'
                : 'bg-white text-[#12203A] border border-[#CDCDC0] hover:bg-[#EEEEE7]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Publish History ({history.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('quick-guide')}
            className={`px-3 py-1.5 font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'quick-guide'
                ? 'bg-[#12203A] text-[#EEEEE7] border border-[#12203A]'
                : 'bg-white text-[#12203A] border border-[#CDCDC0] hover:bg-[#EEEEE7]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#6A778D]" />
            <span>Manual Git CLI & CI/CD Guide</span>
          </button>
        </div>

        {/* Quick Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadContentJson}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#EEEEE7] text-[#12203A] border border-[#CDCDC0] font-mono text-xs transition-colors"
            title="Download formatted content JSON for manual git staging"
          >
            <Download className="w-3 h-3 text-[#C99A2E]" />
            <span>Download content.json</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {publishFeedback && (
        <div
          className={`p-4 border-2 flex items-start gap-3 ${
            publishFeedback.type === 'success'
              ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#1B5E20]'
              : publishFeedback.type === 'error'
              ? 'bg-[#FFEBEE] border-[#9C3B2E] text-[#B71C1C]'
              : 'bg-[#E3F2FD] border-[#1976D2] text-[#0D47A1]'
          }`}
        >
          {publishFeedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#2E7D32]" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-[#9C3B2E]" />
          )}
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-sm font-serif">{publishFeedback.title}</h4>
            <p className="font-sans leading-relaxed">{publishFeedback.description}</p>
            {publishFeedback.url && (
              <a
                href={publishFeedback.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono font-bold text-[#12203A] hover:underline pt-1"
              >
                <span>View Commit on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 1: PUBLISH MODIFICATIONS */}
      {/* ========================================================================= */}
      {activeSubTab === 'publish' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-[#12203A] p-5 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#CDCDC0] gap-2">
              <div>
                <span className="font-mono text-[10px] text-[#9C3B2E] font-bold uppercase tracking-wider block">
                  Step 1: Staging & Destination
                </span>
                <h4 className="font-serif text-lg font-bold text-[#12203A]">
                  Push Live Content Changes to GitHub
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#6A778D]">Target File:</span>
                <span className="px-2 py-0.5 bg-[#EEEEE7] text-[#12203A] font-mono text-xs font-bold border border-[#CDCDC0]">
                  {config.filePath}
                </span>
              </div>
            </div>

            {/* Commit Message Box */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase font-bold text-[#12203A]">
                Commit Description / Change Summary *
              </label>
              <textarea
                rows={2}
                value={publishMessage}
                onChange={(e) => setPublishMessage(e.target.value)}
                placeholder="e.g., Update CPD seminar speakers, add 2026 General Assembly registration links"
                className="w-full px-3 py-2 bg-[#F6F6F2] border border-[#12203A] text-xs font-mono text-[#12203A] focus:outline-hidden focus:ring-1 focus:ring-[#C99A2E]"
              />
              <p className="text-[11px] text-[#6A778D] font-mono">
                This commit message will appear in your GitHub repository commit log and deployment history.
              </p>
            </div>

            {/* Committer Profile & Destination Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#EEEEE7] border border-[#CDCDC0] text-xs font-mono text-[#12203A]">
              <div>
                <span className="text-[#6A778D] uppercase text-[10px] block">Committer:</span>
                <strong className="text-[#12203A]">{currentUser?.name || 'ICpEP Secretariat'}</strong>
                <span className="text-[10px] text-[#6A778D] block">{currentUser?.email || 'icpep.oman@gmail.com'}</span>
              </div>
              <div>
                <span className="text-[#6A778D] uppercase text-[10px] block">Repository & Branch:</span>
                <strong className="text-[#12203A]">{config.owner}/{config.repo}</strong>
                <span className="text-[10px] text-[#2E7D32] block font-bold">branch: {config.branch}</span>
              </div>
              <div>
                <span className="text-[#6A778D] uppercase text-[10px] block">Push Method:</span>
                <strong className="text-[#12203A]">GitHub REST API v3</strong>
                <span className="text-[10px] text-[#6A778D] block">
                  {config.token.trim() ? '✓ Token Authenticated' : '⚠ Missing Token'}
                </span>
              </div>
            </div>

            {/* Push CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handlePublishToGitHub}
                disabled={isPublishing}
                className="flex-1 py-3 px-6 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] font-mono text-xs uppercase font-bold tracking-wider border border-[#12203A] hover:border-[#C99A2E] shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C99A2E]" />
                    <span>Uploading & Publishing to GitHub...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-[#C99A2E]" />
                    <span>Upload & Publish Modifications to GitHub</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadContentJson}
                className="py-3 px-4 bg-white hover:bg-[#F6F6F2] text-[#12203A] font-mono text-xs uppercase font-bold tracking-wider border border-[#CDCDC0] hover:border-[#12203A] transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4 text-[#C99A2E]" />
                <span>Save Local JSON</span>
              </button>
            </div>
          </div>

          {/* Two Options Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-[#CDCDC0] p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#12203A]">
                <UploadCloud className="w-4 h-4 text-[#C99A2E]" />
                <h5 className="font-serif font-bold text-sm">Direct Push via GitHub API</h5>
              </div>
              <p className="text-xs text-[#3B475C] leading-relaxed">
                Requires entering your GitHub Personal Access Token once in the Repository Configuration tab. Updates are pushed straight to the repository branch, automatically triggering CI/CD, GitHub Pages, or Vercel builds.
              </p>
            </div>

            <div className="bg-white border border-[#CDCDC0] p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#12203A]">
                <Terminal className="w-4 h-4 text-[#12203A]" />
                <h5 className="font-serif font-bold text-sm">Manual Download & Git CLI</h5>
              </div>
              <p className="text-xs text-[#3B475C] leading-relaxed">
                If you prefer not storing a PAT token in the browser, download <code>content.json</code> with one click and run standard <code>git commit</code> / <code>git push</code> commands on your terminal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: REPOSITORY CONFIGURATION */}
      {/* ========================================================================= */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleSaveConfig} className="bg-white border-2 border-[#12203A] p-5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#CDCDC0] gap-2">
            <div>
              <span className="font-mono text-[10px] text-[#9C3B2E] font-bold uppercase tracking-wider block">
                Repository Credentials & Target
              </span>
              <h4 className="font-serif text-lg font-bold text-[#12203A]">
                GitHub Integration Settings
              </h4>
            </div>

            <button
              type="button"
              onClick={handleTestConnection}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EEEEE7] hover:bg-[#E3E3D8] text-[#12203A] border border-[#CDCDC0] font-mono text-xs font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C99A2E]" />
              <span>Test Repository Access</span>
            </button>
          </div>

          {/* Test Status Banner */}
          {verificationStatus !== 'idle' && (
            <div
              className={`p-3 border text-xs font-mono flex items-center justify-between ${
                verificationStatus === 'valid'
                  ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]'
                  : verificationStatus === 'invalid'
                  ? 'bg-[#FFEBEE] border-[#9C3B2E] text-[#9C3B2E]'
                  : 'bg-[#EEEEE7] border-[#CDCDC0] text-[#12203A]'
              }`}
            >
              <div className="flex items-center gap-2">
                {verificationStatus === 'checking' && <RefreshCw className="w-4 h-4 animate-spin" />}
                {verificationStatus === 'valid' && <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />}
                {verificationStatus === 'invalid' && <AlertTriangle className="w-4 h-4 text-[#9C3B2E]" />}
                <span>
                  {verificationStatus === 'checking' && 'Connecting to GitHub API...'}
                  {verificationStatus === 'valid' && `Repository verified: https://github.com/${config.owner}/${config.repo}`}
                  {verificationStatus === 'invalid' && `Verification Failed: ${verificationError}`}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Owner */}
            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold text-[#12203A] uppercase">
                GitHub Owner / Organization *
              </label>
              <input
                type="text"
                value={config.owner}
                onChange={(e) => setConfig({ ...config, owner: e.target.value })}
                placeholder="e.g., icpep-oman or your-username"
                className="w-full px-3 py-2 bg-[#F6F6F2] border border-[#12203A] text-xs font-mono text-[#12203A] focus:outline-hidden"
                required
              />
              <span className="text-[10px] text-[#6A778D] font-mono">
                The GitHub account or organization hosting the website repository.
              </span>
            </div>

            {/* Repository */}
            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold text-[#12203A] uppercase">
                Repository Name *
              </label>
              <input
                type="text"
                value={config.repo}
                onChange={(e) => setConfig({ ...config, repo: e.target.value })}
                placeholder="e.g., icpep-oman-portal"
                className="w-full px-3 py-2 bg-[#F6F6F2] border border-[#12203A] text-xs font-mono text-[#12203A] focus:outline-hidden"
                required
              />
              <span className="text-[10px] text-[#6A778D] font-mono">
                Repository name on GitHub (without the https://github.com/ prefix).
              </span>
            </div>

            {/* Branch */}
            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold text-[#12203A] uppercase">
                Target Branch *
              </label>
              <input
                type="text"
                value={config.branch}
                onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                placeholder="main"
                className="w-full px-3 py-2 bg-[#F6F6F2] border border-[#12203A] text-xs font-mono text-[#12203A] focus:outline-hidden"
                required
              />
              <span className="text-[10px] text-[#6A778D] font-mono">
                Branch to commit modifications to (typically <code>main</code> or <code>production</code>).
              </span>
            </div>

            {/* File Path */}
            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold text-[#12203A] uppercase">
                Content File Path in Repo *
              </label>
              <input
                type="text"
                value={config.filePath}
                onChange={(e) => setConfig({ ...config, filePath: e.target.value })}
                placeholder="src/data/content.json"
                className="w-full px-3 py-2 bg-[#F6F6F2] border border-[#12203A] text-xs font-mono text-[#12203A] focus:outline-hidden"
                required
              />
              <span className="text-[10px] text-[#6A778D] font-mono">
                Target path where live website data is stored in the repository.
              </span>
            </div>
          </div>

          {/* Token Box */}
          <div className="space-y-2 pt-2 border-t border-[#CDCDC0]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold text-[#12203A] uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C99A2E]" />
                <span>GitHub Personal Access Token (PAT)</span>
              </label>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=ICpEP-Oman-AdminDesk"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-[#9C3B2E] hover:underline flex items-center gap-1"
              >
                <span>Generate Token on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={config.token}
                onChange={(e) => setConfig({ ...config, token: e.target.value })}
                placeholder="Enter your GitHub Personal Access Token (PAT)"
                className="w-full px-3 py-2 pr-10 bg-[#F6F6F2] border border-[#12203A] text-xs font-mono text-[#12203A] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2.5 top-2.5 text-[#6A778D] hover:text-[#12203A]"
                title={showToken ? 'Hide token' : 'Show token'}
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-[#6A778D] font-mono leading-relaxed">
              Required for automated direct pushes. Needs <code>repo</code> scope (or fine-grained permission: <code>Contents: Read and write</code>). Your token is saved securely in your browser's private local storage and never transmitted to third parties.
            </p>
          </div>

          {/* Save Status & Action */}
          <div className="pt-2 flex items-center justify-between border-t border-[#CDCDC0]">
            <div>
              {saveStatus && (
                <span className="font-mono text-xs text-[#2E7D32] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{saveStatus}</span>
                </span>
              )}
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] font-mono text-xs uppercase font-bold tracking-wider border border-[#12203A] hover:border-[#C99A2E] transition-all"
            >
              Save Configuration
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: PUBLISH HISTORY */}
      {/* ========================================================================= */}
      {activeSubTab === 'history' && (
        <div className="bg-white border-2 border-[#12203A] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#CDCDC0]">
            <div>
              <span className="font-mono text-[10px] text-[#9C3B2E] font-bold uppercase tracking-wider block">
                Audit & Version Ledger
              </span>
              <h4 className="font-serif text-lg font-bold text-[#12203A]">
                Recent GitHub Publish Events
              </h4>
            </div>

            <span className="font-mono text-xs text-[#6A778D]">
              Total Records: {history.length}
            </span>
          </div>

          {history.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[#6A778D]">
              No publication records logged yet. Modifying and publishing website content will record here.
            </div>
          ) : (
            <div className="divide-y divide-[#CDCDC0] border border-[#CDCDC0]">
              {history.map((item) => (
                <div key={item.id} className="p-3 hover:bg-[#F6F6F2] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                          item.status === 'success'
                            ? 'bg-[#2E7D32] text-white'
                            : 'bg-[#9C3B2E] text-white'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                      <span className="font-bold text-[#12203A]">{item.commitMessage}</span>
                    </div>

                    <div className="text-[11px] text-[#6A778D] flex flex-wrap items-center gap-3">
                      <span>Author: <strong className="text-[#12203A]">{item.author}</strong></span>
                      <span>Target: <strong className="text-[#12203A]">{item.repo} ({item.branch})</strong></span>
                      {item.commitSha && (
                        <span>Commit: <code className="bg-[#EEEEE7] px-1 py-0.2">{item.commitSha}</code></span>
                      )}
                    </div>

                    {item.errorDetails && (
                      <div className="text-[11px] text-[#9C3B2E] bg-[#FFEBEE] p-1.5 mt-1 border border-[#9C3B2E]/20">
                        Error: {item.errorDetails}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 sm:text-right">
                    <span className="text-[10px] text-[#6A778D]">{item.timestamp}</span>
                    {item.commitUrl && (
                      <a
                        href={item.commitUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-[#EEEEE7] hover:bg-[#E3E3D8] text-[#12203A] border border-[#CDCDC0] text-[10px] font-bold flex items-center gap-1"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: QUICK GUIDE & CLI INSTRUCTIONS */}
      {/* ========================================================================= */}
      {activeSubTab === 'quick-guide' && (
        <div className="bg-white border-2 border-[#12203A] p-5 shadow-sm space-y-6">
          <div className="border-b border-[#CDCDC0] pb-3">
            <span className="font-mono text-[10px] text-[#9C3B2E] font-bold uppercase tracking-wider block">
              Documentation & Technical Protocol
            </span>
            <h4 className="font-serif text-lg font-bold text-[#12203A]">
              Publishing Workflow & Terminal Commands
            </h4>
          </div>

          {/* Terminal Command Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#12203A] uppercase">
                Terminal Commands (Git CLI)
              </span>
              <button
                type="button"
                onClick={handleCopyGitCommands}
                className="px-2 py-1 bg-[#EEEEE7] hover:bg-[#E3E3D8] border border-[#CDCDC0] text-[11px] font-mono flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-3 h-3 text-[#2E7D32]" /> : <Copy className="w-3 h-3 text-[#12203A]" />}
                <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Commands'}</span>
              </button>
            </div>

            <pre className="p-4 bg-[#12203A] text-[#C99A2E] font-mono text-xs overflow-x-auto border-2 border-[#12203A]">
{`# 1. Save downloaded content file into your repository
cp ~/Downloads/content.json ${config.filePath}

# 2. Review diff
git status
git diff ${config.filePath}

# 3. Commit and push modifications
git add ${config.filePath}
git commit -m "${publishMessage.replace(/"/g, '\\"')}"
git push origin ${config.branch}`}
            </pre>
          </div>

          {/* CI/CD Explanation */}
          <div className="p-4 bg-[#F6F6F2] border border-[#CDCDC0] space-y-3 text-xs font-sans text-[#3B475C] leading-relaxed">
            <h5 className="font-serif font-bold text-sm text-[#12203A]">
              Automated Deployment Pipelines (GitHub Actions / Cloud Run / Vercel)
            </h5>
            <p>
              When modifications are pushed to <code>{config.branch}</code>, your repository's automated CI/CD workflow will automatically build and publish the changes:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-[#12203A]">
              <li>GitHub Pages: Uses <code>.github/workflows/deploy.yml</code> to build <code>dist/</code> with relative asset paths. Set repository Settings → Pages → Source to <strong>GitHub Actions</strong> to avoid a blank white screen.</li>
              <li>Google Cloud Run / AI Studio: Syncs automatically with repository changes.</li>
              <li>PRC Accreditation Archival: Every commit SHA provides an immutable audit trail for governance compliance.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
