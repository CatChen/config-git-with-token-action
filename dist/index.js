var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getInput, group, setFailed } from '@actions/core';
import { tokenWhoAmI } from 'token-who-am-i-action';
import { configGh } from './configGh.js';
import { configGit } from './configGit.js';
export function configGitWithToken(githubToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const me = yield group('Run token-who-am-i', () => __awaiter(this, void 0, void 0, function* () {
            return yield tokenWhoAmI(githubToken);
        }));
        yield configGh(githubToken);
        yield configGit(githubToken, me.login, me.name, me.email);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const githubToken = getInput('github-token');
        yield configGitWithToken(githubToken);
    });
}
run().catch((error) => setFailed(error));
