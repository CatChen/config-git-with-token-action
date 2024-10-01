import { getInput, group, setFailed } from '@actions/core';
import { tokenWhoAmI } from 'token-who-am-i-action';
import { configGh } from './configGh.js';
import { configGit } from './configGit.js';

export async function configGitWithToken(githubToken: string): Promise<void> {
  const me = await group('Run token-who-am-i', async () => {
    return await tokenWhoAmI(githubToken);
  });

  await configGh(githubToken);

  await configGit(githubToken, me);
}

async function run(): Promise<void> {
  const githubToken = getInput('github-token');
  await configGitWithToken(githubToken);
}

run().catch((error: Error) => setFailed(error));
