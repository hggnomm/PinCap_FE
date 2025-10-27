declare module "react-masonry-css" {
  import { Component } from "react";

  interface MasonryProps {
    breakpointCols?:
      | number
      | {
          default: number;
          [key: number]: number;
        };
    className?: string;
    columnClassName?: string;
    columnAttrs?: {
      className?: string;
      [key: string]: string | number | boolean;
    };
    children?: React.ReactNode;
  }

  export default class Masonry extends Component<MasonryProps> {}
}
