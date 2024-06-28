"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configGitWithToken = configGitWithToken;
const core_1 = require("@actions/core");
const exec_1 = require("@actions/exec");
const token_who_am_i_1 = require("token-who-am-i");
function configGitWithToken(githubToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const me = yield (0, core_1.group)('Run token-who-am-i', () => __awaiter(this, void 0, void 0, function* () {
            return yield (0, token_who_am_i_1.tokenWhoAmI)(githubToken);
        }));
        (0, core_1.notice)(`Token login: ${me.login}`);
        yield (0, core_1.group)('Configure gh', () => __awaiter(this, void 0, void 0, function* () {
            (0, core_1.exportVariable)('GH_TOKEN', githubToken);
            yield (0, exec_1.getExecOutput)('gh', ['auth', 'status']);
            yield (0, exec_1.getExecOutput)('gh', ['auth', 'setup-git']);
        }));
        yield (0, core_1.group)('Configure git', () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield (0, exec_1.getExecOutput)('git', ['config', '--list']);
            yield (0, exec_1.getExecOutput)('git', [
                'config',
                '--global',
                'user.email',
                (_a = me.email) !== null && _a !== void 0 ? _a : '',
            ]);
            yield (0, exec_1.getExecOutput)('git', [
                'config',
                '--global',
                'user.name',
                (_b = me.name) !== null && _b !== void 0 ? _b : me.login,
            ]);
            const remoteOutput = yield (0, exec_1.getExecOutput)('git', [
                'remote',
                'get-url',
                'origin',
            ]);
            const originUrl = remoteOutput.stdout.trim();
            const originUrlWithToken = originUrl.replace(/^https:\/\//, `https://${me.login}:${githubToken}@`);
            yield (0, exec_1.getExecOutput)('git', [
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
        const githubToken = (0, core_1.getInput)('github-token');
        yield configGitWithToken(githubToken);
    });
}
run().catch((error) => (0, core_1.setFailed)(error));
