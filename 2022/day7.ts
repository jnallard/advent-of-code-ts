import { sum } from "../helpers";
import { INPUT, TEST_INPUT } from "./input/input-day7";

const allDirs: Directory[] = [];

class File {
    public size: number;
    public name: string;
    constructor(private input: string) {
        const parts = input.split(' ');
        this.size = +parts[0];
        this.name = parts[1];
    }
}

class Directory {
    subdirs: Map<string, Directory> = new Map();
    files: File[] = [];
    size = 0;
    constructor(public name: string, public parent: Directory | null) {
        allDirs.push(this);
    }

    openSubDir(input: string) {
        const subDirName = input.split(" ")[2];
        return this.subdirs.get(subDirName);
    }

    addFile(input: string) {
        const newFile = new File(input);
        this.files.push(newFile);
        this.size += newFile.size;
        let aDir = this.parent;
        while(aDir) {
            aDir.size += newFile.size;
            aDir = aDir.parent;
        }
    }

    addSubDir(input: string) {
        const subDirName = input.split(" ")[1];
        if(!this.subdirs.has(subDirName)) {
            this.subdirs.set(subDirName, new Directory(subDirName, this));
        }
    }
}

function day() {
    const root = new Directory("/", null);
    let currentDir = root;
    const lines =  INPUT.trim().split('\n').map(s => s);
    for(let line of lines) {
        if(line === '$ cd /') {
            currentDir = root;
        } else if(line === '$ ls') {
            // do nothing
        } else if(line === '$ cd ..') {
            currentDir = currentDir.parent ?? root;
        } else if(line.startsWith('$ cd ')) {
            currentDir = currentDir.openSubDir(line) ?? root;
        } else if(line.startsWith('dir')) {
            currentDir.addSubDir(line);
        } else {
            currentDir.addFile(line)
        }
    }
    let part1Answer = sum(allDirs.filter(dir => dir.size <= 100000).map(dir => dir.size));
    console.log('Part 1', part1Answer);

    const targetSize = 70000000 - 30000000;
    let part2Answer = allDirs.sort((a, b) => a.size - b.size).find(dir => root.size - dir.size <= targetSize)?.size;
    console.log('Part 2', part2Answer);
}
day();