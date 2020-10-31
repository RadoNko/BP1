import { LeafNode } from './leaf-node';
import {ActionEditorService} from '../action-editor.service';

describe('LeafNode', () => {
  it('should create an instance', () => {
    expect(new LeafNode(new ActionEditorService())).toBeTruthy();
  });
});
