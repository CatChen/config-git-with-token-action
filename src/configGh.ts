import { exportVariable, group } from '@actions/core';
import { getExecOutput } from '@actions/exec';

export async function configGh(githubToken: string) {
  await group('Configure gh', async () => {
    exportVariable('GH_TOKEN', githubToken);
    await getExecOutput('gh', ['auth', 'status']);
    await getExecOutput('gh', ['auth', 'setup-git']);
  });
}
