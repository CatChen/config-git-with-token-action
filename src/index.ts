import {
  exportVariable,
  getInput,
  group,
  notice,
  setFailed,
} from '@actions/core';
import { getExecOutput } from '@actions/exec';
import { tokenWhoAmI } from 'token-who-am-i';

export async function configGitWithToken(githubToken: string): Promise<void> {
  const me = await group('Run token-who-am-i', async () => {
    return await tokenWhoAmI(githubToken);
  });
  notice(`Token login: ${me.login}`);

  await group('Configure gh', async () => {
    exportVariable('GH_TOKEN', githubToken);
    await getExecOutput('gh', ['auth', 'status']);
    await getExecOutput('gh', ['auth', 'setup-git']);
  });

  await group('Configure git', async () => {
    await getExecOutput('git', ['config', '--list']);
    await getExecOutput('git', [
      'config',
      '--global',
      'user.email',
      me.email ?? '',
    ]);
    await getExecOutput('git', [
      'config',
      '--global',
      'user.name',
      me.name ?? me.login,
    ]);
    const remoteOutput = await getExecOutput('git', [
      'remote',
      'get-url',
      'origin',
    ]);
    const originUrl = remoteOutput.stdout.trim();
    const originUrlWithToken = originUrl.replace(
      /^https:\/\//,
      `https://${me.login}:${githubToken}@`,
    );
    await getExecOutput('git', [
      'remote',
      'set-url',
      'origin',
      originUrlWithToken,
    ]);
  });
}

async function run(): Promise<void> {
  const githubToken = getInput('github-token');
  await configGitWithToken(githubToken);
}

run().catch((error: Error) => setFailed(error));
