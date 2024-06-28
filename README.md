# config-git-with-token-action

As a GitHub Actions author, have you received GitHub token and tried to `git commit` and `git push` on behave of the identity behind that token? This GitHub Action helps you set up `git` and `gh` to operate as if you are the user or bot behind the GitHub token.

## Usage as a Reusable Action

When writing a [composite action](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action), use this action as a step to set up `git` and `gh` with the token:

```yaml
runs:
  using: 'composite'
  steps:
    - uses: actions/checkout@v4

    - uses: CatChen/config-git-with-token-action@v1
      with:
        github-token: ${{ inputs.github-token }}

    - shell: bash
      run: |
        echo "Set up git user name: $(git config --get user.name)"
        echo "Set up git user email: $(git config --get user.email)"
        echo "Set up git remote origin with login and token: $(git remote get-url origin)"

    - shell: bash
      run: |
        touch test_file
        git commit test_file -m 'Created test file'
        git push
```

## Usage as a JavaScript Package

When creating a [JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action), install the `config-git-with-token-action` package and use it to set up `git` and `gh` in the same way.

```bash
npm i config-git-with-token-action
```

Use `npm` from above or `yarn` from below to install the `token-who-am-i-action` package.

```bash
yarn add config-git-with-token-action
```

Import `configGitWithToken` function from the package and call it to set up `git` and `gh`:

```TypeScript
import { configGitWithToken } from 'config-git-with-token-action';

await configGitWithToken(githubToken);
```
