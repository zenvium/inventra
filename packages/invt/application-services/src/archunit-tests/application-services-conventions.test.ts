import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeApplicationServicesLayoutTests } from '@invt-verification/archunit-tests/application-services';

const applicationServicesRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describeApplicationServicesLayoutTests({ applicationServicesRoot });
