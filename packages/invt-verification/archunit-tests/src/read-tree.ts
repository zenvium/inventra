import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export interface DirectoryEntry {
	name: string;
	absolutePath: string;
}

export async function directoryExists(directory: string): Promise<boolean> {
	try {
		const info = await stat(directory);
		return info.isDirectory();
	} catch {
		return false;
	}
}

export async function fileExists(filePath: string): Promise<boolean> {
	try {
		const info = await stat(filePath);
		return info.isFile();
	} catch {
		return false;
	}
}

export async function listDirectories(directory: string): Promise<DirectoryEntry[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	return entries
		.filter((entry) => entry.isDirectory())
		.map((entry) => ({
			name: entry.name,
			absolutePath: path.join(directory, entry.name),
		}))
		.sort((left, right) => left.name.localeCompare(right.name));
}

export async function listFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	return entries
		.filter((entry) => entry.isFile())
		.map((entry) => entry.name)
		.sort((left, right) => left.localeCompare(right));
}

export function readText(filePath: string): Promise<string> {
	return readFile(filePath, 'utf8');
}
