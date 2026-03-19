import React from "react";

type Expression = string | number | boolean;

export function Switch({
  expression,
  children,
}: {
  expression: Expression;
  children: React.ReactNode;
}) {
  let match: React.ReactNode = null;
  let defaultCase: React.ReactNode = null;

  React.Children.forEach(children, (child: any) => {
    if (!child) return;

    if (child.type === Case) {
      if (match === null && child.props.value === expression) {
        match = child.props.children;
      }
    }

    if (child.type === Default) {
      defaultCase = child.props.children;
    }
  });

  return <>{match ?? defaultCase}</>;
}

export function Case({
  children,
  value: _,
}: {
  children: React.ReactNode;
  value: Expression;
}) {
  return <>{children}</>;
}

export function Default({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
