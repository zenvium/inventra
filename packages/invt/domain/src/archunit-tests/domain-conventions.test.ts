import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeDomainLayoutTests } from '@invt-verification/archunit-tests/domain';

const domainRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describeDomainLayoutTests({ domainRoot });
