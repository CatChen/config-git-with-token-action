var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { exportVariable, getInput, group, setFailed } from '@actions/core';
import { getExecOutput } from '@actions/exec';
import { tokenWhoAmI } from 'token-who-am-i-action';
export function configGitWithToken(githubToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const me = yield group('Run token-who-am-i', () => __awaiter(this, void 0, void 0, function* () {
            return yield tokenWhoAmI(githubToken);
        }));
        yield group('Configure gh', () => __awaiter(this, void 0, void 0, function* () {
            exportVariable('GH_TOKEN', githubToken);
            yield getExecOutput('gh', ['auth', 'status']);
            yield getExecOutput('gh', ['auth', 'setup-git']);
        }));
        yield group('Configure git', () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield getExecOutput('git', ['config', '--list']);
            yield getExecOutput('git', [
                'config',
                '--global',
                'user.email',
                (_a = me.email) !== null && _a !== void 0 ? _a : '',
            ]);
            yield getExecOutput('git', [
                'config',
                '--global',
                'user.name',
                (_b = me.name) !== null && _b !== void 0 ? _b : me.login,
            ]);
            const remoteOutput = yield getExecOutput('git', [
                'remote',
                'get-url',
                'origin',
            ]);
            const originUrl = remoteOutput.stdout.trim();
            const originUrlWithToken = originUrl.replace(/^https:\/\//, `https://${me.login}:${githubToken}@`);
            yield getExecOutput('git', [
                'remote',
                'set-url',
                'origin',
                originUrlWithToken,
            ]);
        }));
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const githubToken = getInput('github-token');
        yield configGitWithToken(githubToken);
    });
}
run().catch((error) => setFailed(error));
