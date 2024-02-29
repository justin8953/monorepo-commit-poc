// read CHANGELOG.json file and format it to release note

import { readFileSync, writeFileSync } from 'fs';

type Commit = {
    author: string;
    date: string;
    message: string;
    url: string;
}

enum CommitType {
    feat = 'Feature',
    fix = 'Fix',
    perf = 'Performance',
    refactor = 'Refactor',
    style = 'Style',
    test = 'Test',
    chore = 'Chore',
    docs = 'Docs',
    ci = 'CI',
    build = 'Build',
    revert = 'Revert',
    other = 'Other',
}

type ChangeLogData = {
    commits: string[];
    jiraIDs: string[];
    author: string[];
}

type ChangeLogByComponent = Record<string, {
    [CommitType.feat]: ChangeLogData
    [CommitType.fix]: ChangeLogData
    [CommitType.perf]: ChangeLogData
    [CommitType.refactor]: ChangeLogData
    [CommitType.style]: ChangeLogData
    [CommitType.test]: ChangeLogData
    [CommitType.chore]: ChangeLogData
    [CommitType.docs]: ChangeLogData
    [CommitType.ci]: ChangeLogData
    [CommitType.build]: ChangeLogData
    [CommitType.revert]: ChangeLogData
    [CommitType.other]: ChangeLogData
}>
function parseScope(message: string) {
    const match = /\(([^)]+)\)/.exec(message);
    return match ? match[1] : '';
}
function parseType(message: string): CommitType {
    const match = /^(\w+)(?:\(.+\))?:/.exec(message);
    if (!match) {
        return CommitType.other;
    }
    const type = match[1];
    switch (type) {
        case 'feat':
            return CommitType.feat;
        case 'fix':
            return CommitType.fix;
        case 'perf':
            return CommitType.perf;
        case 'refactor':
            return CommitType.refactor;
        case 'style':
            return CommitType.style;
        case 'test':
            return CommitType.test;
        case 'chore':
            return CommitType.chore;
        case 'docs':
            return CommitType.docs;
        case 'ci':
            return CommitType.ci;
        case 'build':
            return CommitType.build;
        case 'revert':
            return CommitType.revert;
        default:
            return CommitType.other;
    }
}
function parseMessage(message: string) {
    const match = /^(\w+)(?:\(.+\))?:\s(.+)/.exec(message);
    return match ? match[2] : '';
}
function parseJiraID(message: string) {
    const match = /\[([A-Z]+-\d+)\]/.exec(message);
    return match ? match[1] : '';
}
const changelog = JSON.parse(readFileSync('CHANGELOG.json', 'utf8')) as Commit[];
const components:ChangeLogByComponent = {
}
changelog.forEach(commit => {
    const type = parseType(commit.message);

    const scope = parseScope(commit.message);
    const message = parseMessage(commit.message);
    const jiraID = parseJiraID(message);
    
    console.log(`### ${scope}`);
    console.log(`### ${type}`);
    console.log(`### ${message}`);
    console.log(`### ${jiraID}`);
    if (!components[scope]) {
        components[scope] = {
            [CommitType.feat]: {
                commits: [],
                jiraIDs: [],
                author: [],
            },
            [CommitType.fix]: {
                commits: [],
                jiraIDs: [],
                author: [],
            },
            [CommitType.perf]: {
                commits: [],
                jiraIDs: [],
                author: [],
            },
            [CommitType.refactor]: {
                commits: [],
                jiraIDs: [],
                author: [],
            },
            [CommitType.style]: {
                commits: [],
                jiraIDs: [],
                author: [],
            },
            [CommitType.test]: {
                commits: [],
                jiraIDs: [],
                author: [],
            },
            [CommitType.chore]: {
                commits: [],
                jiraIDs: [],
                author: [],
            },
            [CommitType.docs]: {
                commits: [],
                jiraIDs: [],
                author: [],
            },
            [CommitType.ci]: {
                commits: [],
                jiraIDs: [],
                author: [],
            },
            [CommitType.build]: {
                commits: [],
                jiraIDs: [],
                author: [],
            },
            [CommitType.revert]: {
                commits: [],
                jiraIDs: [],
                author: [],
            },
            [CommitType.other]: {
                commits: [],
                jiraIDs: [],
                author: [],
            },
        }
    }
    const component = components[scope][type];
    component.commits.push(`${message} by @${commit.author} [Link](${commit.url}) `);
    component.jiraIDs.push(jiraID);
    component.author.push(commit.author);
});

console.log(JSON.stringify(components));

const CHANGELOG_HEADER = "## What's Changed\n\n";
let CHANGELOG_BODY = "";

Object.entries(components).forEach(([scope, component]) => {
    CHANGELOG_BODY += `### ${scope}\n\n`;
    Object.entries(component).forEach(([type, data]) => {
        if (data.commits.length > 0) {
            CHANGELOG_BODY += `#### ${type}\n\n`;
            CHANGELOG_BODY += data.commits.map((commit, index) => {
                return `${index + 1}. ${commit}`;
            }).join('\n');
            CHANGELOG_BODY += '\n\n';
        }
        if(data.jiraIDs.length > 0) {
            CHANGELOG_BODY += `#### Related JIRA IDs \n\n`;
            CHANGELOG_BODY += data.jiraIDs.map((jiraID, index) => {
                return `${index + 1}. ${jiraID}`;
            }).join('\n');
            CHANGELOG_BODY += '\n\n';
        }
        if(data.author.length > 0) {
            CHANGELOG_BODY += `#### Authors \n\n`;
            CHANGELOG_BODY += data.author.map((author, index) => {
                return `${index + 1}. @${author}`;
            }).join('\n');
            CHANGELOG_BODY += '\n\n';
        }
    });
});

const CHANGELOG_FOOTER = "\n\n---\n\n";

const CHANGELOG = CHANGELOG_HEADER + CHANGELOG_BODY + CHANGELOG_FOOTER;

// write to CHANGELOG.md
writeFileSync('CHANGELOG.md', CHANGELOG);
