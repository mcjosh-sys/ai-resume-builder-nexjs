import React, { Children, isValidElement } from "react";

type IfProps = {
  condition: boolean;
  children: React.ReactNode;
  className?: string;
};

type ElseIfProps = {
  condition: boolean;
  children: React.ReactNode;
  className?: string;
};

type ElseProps = {
  children: React.ReactNode;
  className?: string;
};

const ElseIf: React.FC<ElseIfProps> = ({ children, className }) => {
  return className ? (
    <div className={className}>{children}</div>
  ) : (
    <>{children}</>
  );
};

ElseIf.displayName = "ElseIf";

const Else: React.FC<ElseProps> = ({ children, className }) => {
  return className ? (
    <div className={className}>{children}</div>
  ) : (
    <>{children}</>
  );
};

Else.displayName = "Else";

export const If: React.FC<IfProps> & {
  ElseIf: typeof ElseIf;
  Else: typeof Else;
} = ({ condition, children, className }) => {
  if (!children) return null;

  const childrenArray = Children.toArray(children);

  if (condition) {
    const mainChildren = childrenArray.filter(
      (child) =>
        !isValidElement(child) ||
        (child.type !== ElseIf && child.type !== Else),
    );

    if (mainChildren.length === 0) return null;

    const content = mainChildren.length === 1 ? mainChildren[0] : mainChildren;

    return className ? (
      <div className={className}>{content}</div>
    ) : (
      <>{content}</>
    );
  }

  for (const child of childrenArray) {
    if (isValidElement(child)) {
      if (child.type === ElseIf && (child.props as ElseIfProps).condition) {
        return (child.props as ElseIfProps).className ? (
          <div className={(child.props as ElseIfProps).className}>
            {(child.props as ElseIfProps).children}
          </div>
        ) : (
          <>{(child.props as ElseIfProps).children}</>
        );
      }

      if (child.type === Else) {
        return (child.props as ElseProps).className ? (
          <div className={(child.props as ElseProps).className}>
            {(child.props as ElseProps).children}
          </div>
        ) : (
          <>{(child.props as ElseProps).children}</>
        );
      }
    }
  }

  return null;
};

If.ElseIf = ElseIf;
If.Else = Else;
