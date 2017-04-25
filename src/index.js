export default function({types: t}){
    return {
        visitor: {
            CallExpression(path){
                if (t.isMemberExpression(path.node.callee) && t.isIdentifier(path.node.callee.object, {name: 'Object'})) {
                    let isValues = t.isIdentifier(path.node.callee.property, {name: 'values'});
                    let isEntries = t.isIdentifier(path.node.callee.property, {name: 'entries'});

                    if (isValues || isEntries) {
                        let target = path.node.arguments[0];

                        let parameter = t.identifier('target');
                        let key = t.identifier('key');
                        let value = t.memberExpression(
                            parameter,
                            key,
                            true
                        );

                        let item = isEntries ? t.arrayExpression([key, value]) : value;

                        path.replaceWith(
                            t.callExpression(
                                t.arrowFunctionExpression(
                                    [parameter],
                                    t.callExpression(
                                        t.memberExpression(
                                            t.callExpression(
                                                t.memberExpression(
                                                    t.identifier('Object'),
                                                    t.identifier('keys')
                                                ),
                                                [
                                                    parameter
                                                ]
                                            ),
                                            t.identifier('map')
                                        ),
                                        [
                                            t.arrowFunctionExpression([key], item)
                                        ]
                                    )
                                ),
                                [target]
                            )
                        );
                    }
                }
            }
        }
    };
}
