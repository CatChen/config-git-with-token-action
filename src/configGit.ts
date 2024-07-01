import { group } from '@actions/core';
import { getExecOutput } from '@actions/exec';

export async function configGit(
  githubToken: string,
  username: string,
  name?: string,
  email?: string,
): Promise<void> {
  await group('Configure git', async () => {
    await getExecOutput('git', ['config', '--list']);
    await getExecOutput('git', [
      'config',
      '--global',
      'user.email',
      email ?? '',
    ]);
    await getExecOutput('git', [
      'config',
      '--global',
      'user.name',
      name ?? username,
    ]);
    const remoteOutput = await getExecOutput('git', [
      'remote',
      'get-url',
      'origin',
    ]);
    const originUrl = remoteOutput.stdout.trim();
    const originUrlWithToken = originUrl.replace(
      /^https:\/\//,
      `https://${username}:${githubToken}@`,
    );
    await getExecOutput('git', [
      'remote',
      'set-url',
      'origin',
      originUrlWithToken,
    ]);
  });
}
