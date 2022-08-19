import {permissionsProcessor} from './permissionsProcessor';
import {resolverProcessor} from './resolverProcessor';
import {schemaProcessor} from './schemaProcessor';
import {importsProcessor} from './importsProcessor';
import {validationsProcessor} from './validationsProcessor';
import {objectInterfacesProcessor} from './objectInterfacesProcessor';
import {interfacesProcessor} from './interfacesProcessor';
import {functionsProcessor} from './functionsProcessor';
import {optionsProcessor} from './optionsProcessor';
import {relationshipsProcessor} from './relationshipsProcessor';

export default [
  importsProcessor,
  objectInterfacesProcessor,
  interfacesProcessor,
  validationsProcessor,
  permissionsProcessor,
  optionsProcessor,
  relationshipsProcessor,
  functionsProcessor,
  resolverProcessor,
  schemaProcessor,
];
