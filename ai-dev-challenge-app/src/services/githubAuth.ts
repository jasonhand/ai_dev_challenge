export class GitHubAuth {
  private static readonly CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID || '';
  private static readonly REDIRECT_URI = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : window.location.origin;
  
  static async authenticateWithGitHub(): Promise<string | null> {
    // Check if we already have a token
    const existingToken = this.getStoredToken();
    if (existingToken) {
      console.log('Using existing token from sessionStorage');
      return existingToken;
    }
    
    // Always prompt for token (both development and production)
    const token = await this.promptForToken();
    if (token) {
      console.log('Storing new token in sessionStorage');
      sessionStorage.setItem('github_token', token);
      return token;
    }
    
    console.log('No token provided by user');
    return null;
  }
  
  private static async promptForToken(): Promise<string | null> {
    return new Promise((resolve) => {
      // Create a modal to prompt for GitHub token
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `;
      
      const content = document.createElement('div');
      content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      `;
      
      content.innerHTML = `
        <h2 style="margin: 0 0 1rem 0; color: #333;">Connect to GitHub</h2>
        <p style="margin: 0 0 1rem 0; color: #666; font-size: 14px;">
          To access GitHub data, you need to provide a Personal Access Token.
        </p>
        <div style="margin: 0 0 1rem 0;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">GitHub Personal Access Token:</label>
          <input 
            type="password" 
            id="github-token-input"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;"
          />
        </div>
        <div style="margin: 0 0 1rem 0; padding: 0.75rem; background: #f8f9fa; border-radius: 4px; font-size: 12px; color: #666;">
          <strong>How to get a token:</strong><br>
          1. Go to <a href="https://github.com/settings/tokens" target="_blank" style="color: #0366d6;">GitHub Settings → Tokens</a><br>
          2. Click "Generate new token (classic)"<br>
          3. Select scopes: <code>repo</code> and <code>read:user</code><br>
          4. Copy the token and paste it above
        </div>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
          <button id="cancel-token" style="padding: 0.5rem 1rem; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">
            Cancel
          </button>
          <button id="submit-token" style="padding: 0.5rem 1rem; background: #0366d6; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Connect
          </button>
        </div>
      `;
      
      modal.appendChild(content);
      document.body.appendChild(modal);
      
      const input = content.querySelector('#github-token-input') as HTMLInputElement;
      const submitBtn = content.querySelector('#submit-token') as HTMLButtonElement;
      const cancelBtn = content.querySelector('#cancel-token') as HTMLButtonElement;
      
      const cleanup = () => {
        document.body.removeChild(modal);
      };
      
      submitBtn.onclick = () => {
        const token = input.value.trim();
        if (token && token.startsWith('ghp_')) {
          cleanup();
          resolve(token);
        } else {
          alert('Please enter a valid GitHub Personal Access Token (starts with ghp_)');
        }
      };
      
      cancelBtn.onclick = () => {
        cleanup();
        resolve(null);
      };
      
      // Focus the input
      input.focus();
    });
  }
  
  static getStoredToken(): string | null {
    const token = sessionStorage.getItem('github_token');
    return token;
  }
  
  static clearToken(): void {
    sessionStorage.removeItem('github_token');
  }
} 