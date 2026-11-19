import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describePersistenceLayoutTests } from '@invt-verification/archunit-tests/persistence';

const persistenceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describePersistenceLayoutTests({ persistenceRoot });
