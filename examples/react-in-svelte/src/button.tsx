import React from 'react';

export default function Button(props: any) {
  return <button onClick={props.onClick}>react is {props.count}</button>;
}
