import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { ReactNode } from "react";

const GluestackProvider = ({ children }: { children: ReactNode }) => {
  return (
    <GluestackUIProvider config={config} colorMode={"light"}>
      {children}
    </GluestackUIProvider>
  );
};

export default GluestackProvider;
