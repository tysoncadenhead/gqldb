import {setAdapter} from '..';
import {memoryAdapter} from '../adapters/memoryAdapter';
import {setup} from './setup';

setAdapter(memoryAdapter);
setup();
