import { Fragment, ReactNode } from "react";

type ValidItem = Record<string, any> | any[] | null;

interface MapProps<T> {
  items: T;
  keyProp?: string;
  children: T extends Array<infer U>
    ? (item: U, index: number) => ReactNode
    : T extends Record<string, infer V>
      ? (value: V, key: string, index: number) => ReactNode
      : ReactNode;
}

export function MapItems<T extends ValidItem>({
  items,
  children,
  keyProp,
}: MapProps<T>) {
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  const renderItem = (
    item: any,
    fallbackKey: string | number,
    index: number,
    objectKey?: string,
  ) => {
    const key = keyProp ? getNestedValue(item, keyProp) : fallbackKey;

    if (typeof children === "function") {
      return (
        <Fragment key={key ?? fallbackKey}>
          {objectKey !== undefined
            ? (children as Function)(item, objectKey, index)
            : (children as Function)(item, index)}
        </Fragment>
      );
    }
    return null;
  };

  if (typeof children !== "function") {
    return <>{children}</>;
  }

  if (!items) return null;

  if (Array.isArray(items)) {
    return <>{items.map((item, i) => renderItem(item, i, i))}</>;
  }

  return (
    <>
      {Object.entries(items).map(([key, value], i) =>
        renderItem(value, key, i, key),
      )}
    </>
  );
}
