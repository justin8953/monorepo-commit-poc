# Monorepo Release Workflow PoC


## Flow

1. When merging to main, the workflow will run on the staging environment. 
2. Find the previous production release tag name via using Github REST API
3. Tag the current PR commit hash with the name staging-`<component>`-`<timestamp>`
4. Generate release note and upload the artifact with the name staging-`<component>`-`<timestamp>`-release-note for later use

    a.  use Github REST API to find the related PR via current tag

    b. use Github REST API to find the related commit messages via the PR number and generate a JSON file for later formatting release note file use

    c. run the typescript file to generate release note. Note: commit message should follow the convention commit.e.g `feat(dto): [JIRA ID] message here`

5.  create draft release with staging-`<component>`-`<timestamp>`

6. getting approval on the production deployment

7. Tag the current PR commit hash with the name prod-`<component>`-`<timestamp>`

8. create release with prod-`<component>`-`<timestamp>` and use the staging-`<component>`-`<timestamp>`-release-note

9. delete the draft release


## Release note template

Below is the template of release note

```
## What's Changed

### component name (component name or other if component name is not provided)

#### commit type (Feature, CI, etc)

1. commit message by @username commit link (JIRA ID)

#### Related JIRA IDs

1. JIRA ID

#### Authors
1. @username

[Full Changelog](the link compares with current tag and previous release)
```

## Improvement

1. Update tag name and release tile to let Github UI sorts well and make people search easily
2. Update workflow to delete draft release when deployment is rejected 
3. Remove artifact when production release is created