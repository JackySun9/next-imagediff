/**
 * Fetches the file content from the GitHub repository.
 * @param repo The repository in the format "username/repo".
 * @param path The path to the file in the repository.
 * @returns 
 */
export async function fetchFileFromGithub(repo: string, path: string): Promise<any[]> {
    try {
      const [owner, repoName] = repo.split('/');
      const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch the file from GitHub. Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred while fetching file content.');
    }
  }
  