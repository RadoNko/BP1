import {Injectable} from '@angular/core';
import {ActionGroup} from './classes/action-group';
import {LeafNode, TreeNode} from './classes/leaf-node';
import {ActionType, EditableAction} from './classes/editable-action';
import {ActionEditorService} from './action-editor.service';
import {BehaviorSubject} from 'rxjs';

export enum Actions {
  PRE_ASSIGN,
  POST_ASSIGN,
  PRE_FINISH,
  POST_FINISH,
  PRE_CANCEL,
  POST_CANCEL,
  PRE_DELEGATE,
  POST_DELEGATE
}

@Injectable({
  providedIn: 'root'
})
export class ActionEditorTreeService {

  constructor(private actionEditorService: ActionEditorService) {
  }

  public static getAllActionsOfSubTree(subTreeRoot: TreeNode): Array<EditableAction> {
    if (!!subTreeRoot.actions) {
      return subTreeRoot.actions;
    }
    const subtreeActions = [];
    subTreeRoot.children.forEach(child => {
      subtreeActions.push(ActionEditorTreeService.getAllActionsOfSubTree(child));
    });

    return [].concat(...subtreeActions);
  }

  private static getActionIndex(action: EditableAction): number {
    return ActionEditorTreeService.getActionIndexBase(action) + (action.phase === 'pre' ? 0 : 1);
  }

  private static getActionIndexBase(action: EditableAction): number {
    let base;
    switch (action.event) {
      case 'assign':
        base = 0;
        break;
      case 'finish':
        base = 2;
        break;
      case 'cancel':
        base = 4;
        break;
      case 'delegate':
        base = 6;
        break;
    }
    return base;
  }

  private static subscribeToChildStreams(parent: TreeNode): void {
    parent.actionCount = new BehaviorSubject<number>(parent.children.reduce((accumulator: number, current: TreeNode) => accumulator + current.actionCount.getValue(), 0));
    parent.children.forEach(child => {
      child.actionCount.subscribe(newCount => parent.actionCount.next(parent.children.reduce((accumulator: number, current: TreeNode) => accumulator + current.actionCount.getValue(), 0)));
    });
  }

  public createTransitionTreeStructure(actionGroups: Array<ActionGroup>, collapseCallback: (leaf: TreeNode, actionCount: number) => void): Array<TreeNode> {
    const transitionActionGroup = actionGroups.find(it => it.actionsType === ActionType.TRANSITION);
    const transitionActions = [[], [], [], [], [], [], [], []];
    transitionActionGroup.editableActions.forEach(action => {
      transitionActions[ActionEditorTreeService.getActionIndex(action)].push(action);
    });
    const transitionNode = {
      title: 'Events',
      type: ActionType.TRANSITION,
      actionCount: null,
      children: [
        {
          title: 'Assign',
          id: 'assign',
          parent: undefined,
          actionCount: null,
          children: this.createTwoOptionsSubTree(ActionType.TRANSITION, 'pre', 'Pre', 'post', 'Post', collapseCallback, transitionActions[Actions.PRE_ASSIGN], transitionActions[Actions.POST_ASSIGN], 'assign')
        },
        {
          title: 'Finish',
          id: 'finish',
          parent: undefined,
          actionCount: null,
          children: this.createTwoOptionsSubTree(ActionType.TRANSITION, 'pre', 'Pre', 'post', 'Post', collapseCallback, transitionActions[Actions.PRE_FINISH], transitionActions[Actions.POST_FINISH], 'finish')
        },
        {
          title: 'Cancel',
          id: 'cancel',
          parent: undefined,
          actionCount: null,
          children: this.createTwoOptionsSubTree(ActionType.TRANSITION, 'pre', 'Pre', 'post', 'Post', collapseCallback, transitionActions[Actions.PRE_CANCEL], transitionActions[Actions.POST_CANCEL], 'cancel')
        },
        {
          title: 'Delegate',
          id: 'delegate',
          parent: undefined,
          actionCount: null,
          children: this.createTwoOptionsSubTree(ActionType.TRANSITION, 'pre', 'Pre', 'post', 'Post', collapseCallback, transitionActions[Actions.PRE_DELEGATE], transitionActions[Actions.POST_DELEGATE], 'delegate')
        }
      ]
    };
    transitionNode.children.forEach(node => {
      node.parent = transitionNode;
      node.children.forEach(child => {
        child.parent = node;
      });
      ActionEditorTreeService.subscribeToChildStreams(node);
    });
    ActionEditorTreeService.subscribeToChildStreams(transitionNode);

    const tree: Array<TreeNode> = [transitionNode];
    actionGroups.filter(it => it.actionsType !== ActionType.TRANSITION).forEach(actions => {
      const datarefNode = {
        title: `Dataref ${actions.parentName}`,
        id: actions.parentName,
        type: ActionType.DATAREF,
        actionCount: null,
        children: this.createDatafieldTreeStructure(actions.editableActions, ActionType.DATAREF, collapseCallback)
      };
      datarefNode.children.forEach(child => {
        child.parent = datarefNode;
      });
      ActionEditorTreeService.subscribeToChildStreams(datarefNode);
      tree.push(datarefNode);
    });

    return tree;
  }

  public createDatafieldTreeStructure(actions: Array<EditableAction>, type: ActionType, collapseCallback: (leaf: TreeNode, actionCount: number) => void): Array<TreeNode> {
    const setActions = [];
    const getActions = [];
    actions.forEach(action => {
      if (action.event === 'set') {
        setActions.push(action);
      } else {
        getActions.push(action);
      }
    });

    return this.createTwoOptionsSubTree(type, 'set', 'Set', 'get', 'Get', collapseCallback, setActions, getActions);
  }

  private createTwoOptionsSubTree(
    type: ActionType,
    id1: string,
    title1: string,
    id2: string,
    title2: string,
    collapseCallback: (leaf: TreeNode, actionCount: number) => void,
    actions1: Array<EditableAction> = [],
    actions2: Array<EditableAction> = [],
    transitionEvent?: string
  ): Array<TreeNode> {
    const child1 = new LeafNode(this.actionEditorService, actions1);
    const child2 = new LeafNode(this.actionEditorService, actions2);
    const subtree = [
      {
        title: title1,
        id: id1,
        canAdd: true,
        type,
        transitionEvent,
        parent: undefined,
        actionCount: null,
        children: [
          child1
        ]
      },
      {
        title: title2,
        id: id2,
        canAdd: true,
        type,
        transitionEvent,
        parent: undefined,
        actionCount: null,
        children: [
          child2
        ]
      }
    ];

    child1.parent = subtree[0];
    child1.actionCount.subscribe(count => {
      collapseCallback(child1, count);
    });

    child2.parent = subtree[1];
    child2.actionCount.subscribe(count => {
      collapseCallback(child2, count);
    });

    ActionEditorTreeService.subscribeToChildStreams(subtree[0]);
    ActionEditorTreeService.subscribeToChildStreams(subtree[1]);

    return subtree;
  }
}
