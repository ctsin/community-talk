type VerticalAlignment = "top" | "middle" | "bottom";
type HorizontalAlignment = "left" | "center" | "right";

// Takes
//   | "top-left"    | "top-center"    | "top-right"
//   | "middle-left" | "middle-center" | "middle-right"
//   | "bottom-left" | "bottom-center" | "bottom-right"
type Alignment = `${VerticalAlignment}-${HorizontalAlignment}`;

declare function setAlignment(value: Alignment): void;
setAlignment("top-left"); // works!
setAlignment("middle-left"); // error!
