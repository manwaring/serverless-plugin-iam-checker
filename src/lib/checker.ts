// import { Config } from './config';
// import { Role } from './cloudformation';

// // export function isIamValid(): boolean {
// //   const { actions, resources } = this.getStringifiedActionsAndResources();
// //   const starActions = this.getStarItems(actions);
// //   const starResources = this.getStarItems(resources);
// //   return (starActions && starActions.length > 0) || (starResources && starResources.length > 0);
// // }

// // function getStringifiedActionsAndResources(): { actions: string[]; resources: string[] } {
// //   const policies = this.role.Properties.Policies;
// //   const statements = policies
// //     .map(policy => policy.PolicyDocument.Statement)
// //     .reduce((statementArr1, statementArr2) => [...statementArr1, ...statementArr2]);
// //   const actions = statements
// //     .map(statement => statement.getAllActions())
// //     .reduce((statementArr1, statementArr2) => [...statementArr1, ...statementArr2]);
// //   const resources = statements
// //     .map(statement => statement.getAllResources())
// //     .reduce((statementArr1, statementArr2) => [...statementArr1, ...statementArr2]);
// //   return { actions, resources };
// // }

// // function getStarItems(items: string[]): string[] {
// //   return items.filter(item => item.replace(/'/g, '').replace(/"/g, '') === '*');
// // }
