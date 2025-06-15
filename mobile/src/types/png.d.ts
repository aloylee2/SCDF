// mobile/src/types/png.d.ts
declare module "*.png" {
  const value: import("react-native").ImageSourcePropType; // <--- Change 'any' to ImageSourcePropType
  export default value;
}
declare module "*.jpg" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}
declare module "*.jpeg" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}
declare module "*.gif" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}