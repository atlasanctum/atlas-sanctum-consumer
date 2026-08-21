import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { AppPressable, Pill } from "@/components/atlas-primitives";
import { atlasColors } from "@/constants/atlas";
import { useAtlas } from "@/lib/atlas-context";

export function AtlasScanner() {
  const { scannerOpen, closeScanner, setLensBarcode, showLensResult } = useAtlas();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  useEffect(() => { if (!scannerOpen) setScanned(false); }, [scannerOpen]);
  const onBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    setLensBarcode(data.trim());
    closeScanner();
    showLensResult();
  };
  return <Modal visible={scannerOpen} animationType="slide" onRequestClose={closeScanner}><View style={styles.screen}>
    {!permission ? <View style={styles.permissionState}><Text style={styles.permissionTitle}>Preparing the camera…</Text></View> : !permission.granted ? <View style={styles.permissionState}><View style={styles.permissionIcon}><MaterialIcons name="photo-camera" size={29} color={atlasColors.paper} /></View><Text style={styles.permissionTitle}>Enable camera for Atlas Lens</Text><Text style={styles.permissionCopy}>Atlas uses the camera only while you choose to scan a barcode. Nothing is captured automatically.</Text><AppPressable accessibilityLabel="Allow camera access" onPress={requestPermission} style={styles.permissionButton}><Text style={styles.permissionButtonText}>Allow camera access</Text></AppPressable><AppPressable accessibilityLabel="Close barcode scanner" onPress={closeScanner} style={styles.cancelButton}><Text style={styles.cancelText}>Not now</Text></AppPressable></View> : <CameraView style={styles.camera} facing="back" barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128", "qr"] }} onBarcodeScanned={scanned ? undefined : onBarcodeScanned}>
      <View style={styles.cameraOverlay}><View style={styles.cameraHeader}><Pill label="ATLAS LENS" tone="sun" /><AppPressable accessibilityLabel="Close barcode scanner" onPress={closeScanner} style={styles.closeButton}><MaterialIcons name="close" size={20} color={atlasColors.paper} /></AppPressable></View><View style={styles.guideArea}><View style={styles.scanFrame}><View style={[styles.corner, styles.topLeft]} /><View style={[styles.corner, styles.topRight]} /><View style={[styles.corner, styles.bottomLeft]} /><View style={[styles.corner, styles.bottomRight]} /></View><Text style={styles.guideTitle}>Align the barcode inside the frame</Text><Text style={styles.guideCopy}>EAN, UPC, QR, and Code 128 are supported</Text></View><View style={styles.cameraFooter}><MaterialIcons name="verified-user" size={17} color="#D7E9DD" /><Text style={styles.cameraFooterText}>Processed only after you scan</Text></View></View>
    </CameraView>}
  </View></Modal>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: atlasColors.greenDark }, camera: { flex: 1 }, cameraOverlay: { backgroundColor: "rgba(12, 40, 31, 0.22)", flex: 1, justifyContent: "space-between", padding: 22 }, cameraHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 18 }, closeButton: { alignItems: "center", backgroundColor: "rgba(19, 34, 28, 0.48)", borderColor: "rgba(255,255,255,0.45)", borderRadius: 99, borderWidth: 1, height: 42, justifyContent: "center", width: 42 }, guideArea: { alignItems: "center", gap: 14 }, scanFrame: { height: 215, position: "relative", width: "82%" }, corner: { borderColor: atlasColors.sun, height: 42, position: "absolute", width: 42 }, topLeft: { borderLeftWidth: 4, borderTopWidth: 4, left: 0, top: 0 }, topRight: { borderRightWidth: 4, borderTopWidth: 4, right: 0, top: 0 }, bottomLeft: { borderBottomWidth: 4, borderLeftWidth: 4, bottom: 0, left: 0 }, bottomRight: { borderBottomWidth: 4, borderRightWidth: 4, bottom: 0, right: 0 }, guideTitle: { color: atlasColors.paper, fontSize: 18, fontWeight: "800", textAlign: "center" }, guideCopy: { color: "#D7E9DD", fontSize: 13, textAlign: "center" }, cameraFooter: { alignItems: "center", alignSelf: "center", backgroundColor: "rgba(19, 34, 28, 0.64)", borderRadius: 99, flexDirection: "row", gap: 7, paddingHorizontal: 13, paddingVertical: 9 }, cameraFooterText: { color: atlasColors.paper, fontSize: 12, fontWeight: "700" }, permissionState: { alignItems: "center", flex: 1, justifyContent: "center", padding: 28 }, permissionIcon: { alignItems: "center", backgroundColor: atlasColors.green, borderRadius: 24, height: 70, justifyContent: "center", marginBottom: 20, width: 70 }, permissionTitle: { color: atlasColors.paper, fontSize: 25, fontWeight: "800", letterSpacing: -0.55, textAlign: "center" }, permissionCopy: { color: "#C5DACE", fontSize: 15, lineHeight: 22, marginTop: 11, textAlign: "center" }, permissionButton: { alignItems: "center", backgroundColor: atlasColors.sun, borderRadius: 16, marginTop: 27, paddingHorizontal: 18, paddingVertical: 15, width: "100%" }, permissionButtonText: { color: atlasColors.ink, fontSize: 15, fontWeight: "900" }, cancelButton: { alignItems: "center", marginTop: 15, padding: 12 }, cancelText: { color: "#D7E9DD", fontSize: 14, fontWeight: "800" },
});
