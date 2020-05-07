import * as vscode from 'vscode';
import * as extension from './extension';

import { findClassName, findType, findFieldDefinition, findMethodDefinition, findFieldReference, findMethodReference } from './language/parser';

export class SmaliReferenceProvider implements vscode.ReferenceProvider {
    public async provideReferences(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.ReferenceContext,
        token: vscode.CancellationToken
    ): Promise<vscode.Location[]> {
        {
            let type = findType(document, position);
            if (type && type.identifier) {
                let locations = await extension.smali.searchSymbolReference([
                    type.identifier,
                    `"${type.identifier.slice(0, -1)}"`,
                ]);
                return [].concat(...locations);
            }
        }
        {
            let myfield = findFieldDefinition(document, position);
            if (myfield) {
                let owner = findClassName(document.getText());
                if (owner) {
                    let locations = await extension.smali.searchSymbolReference([`${owner}->${myfield.toIdentifier()}`]);
                    return locations[0];
                }
            }
        }
        {
            let mymethod = findMethodDefinition(document, position);
            if (mymethod) {
                let owner = findClassName(document.getText());
                if (owner) {
                    const superclasses = await extension.smali.searchSuperClassIds(owner);
                    const references = superclasses.concat(owner).map(id => `${id}->${mymethod.toIdentifier()}`);
                    return [].concat(...await extension.smali.searchSymbolReference(references));
                }
            }
        }
        {
            let { owner, field } = findFieldReference(document, position);
            if (owner && field) {
                let locations = await extension.smali.searchSymbolReference([`${owner.identifier}->${field.toIdentifier()}`]);
                return locations[0];
            }
        }
        {
            let { owner, method } = findMethodReference(document, position);
            if (owner && method) {
                const superclasses = await extension.smali.searchSuperClassIds(owner.identifier);
                const references = superclasses.concat(owner.identifier).map(id => `${id}->${method.toIdentifier()}`);
                return [].concat(...await extension.smali.searchSymbolReference(references));
            }
        }
    }
}