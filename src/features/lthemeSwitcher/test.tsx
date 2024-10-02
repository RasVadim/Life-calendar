import { FC } from "react";

type OtherProps = {
  name: string;
  age: number;
};

const OtherFC: FC<OtherProps> = ({ age, name }) => {
  return (
    <div>
      {name} {age}
    </div>
  );
};

// Обновляем IProps чтобы включить пропсы компонента Component
type IProps<T extends object> = {
  Component: FC<T>;
  height: number;
} & T;

const ContainerFC = <T extends object>({ Component, height, ...restProps }: IProps<T>) => {
  return (
    <div style={{ height: `${height}px` }}>
      <Component {...restProps as T} />
    </div>
  );
};

// Пример использования ContainerFC с OtherFC и его пропсами
const AnyComponent1 = () => {
  return <ContainerFC height={5} Component={OtherFC} name="Макс" age={30} />;
};

// Пример использования ContainerFC с некорректными пропсами, которые должны вызвать ошибки типов
const AnyComponent2 = () => {
  return <ContainerFC height={5} Component={OtherFC} name={30} age="Макс" />;
};

const AnyComponent3 = () => {
  return <ContainerFC height={5} Component={OtherFC} role="Макс" />;
};

export default AnyComponent1;
