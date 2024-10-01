import { group } from '@actions/core';
import { getExecOutput } from '@actions/exec';
import { Actor } from 'token-who-am-i-action';

export async function configGit(githubToken: string, me: Actor): Promise<void> {
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

    if (me.type === 'Bot') {
      return;
    }

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
