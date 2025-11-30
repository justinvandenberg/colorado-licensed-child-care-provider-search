import { FC, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useProviders } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useUser } from "@/providers/UserProvider";

import BackToTopButton from "./ui/BackToTopButton";
import BottomSheetModal, { BottomSheetModalType } from "./ui/BottomSheetModal";

import ProviderBottomSheetModal from "./ProviderBottomSheetModal";
import ProviderCard from "./ProviderCard";
import ProviderListHeader from "./ProviderListHeader";

const ProviderCardList: FC = () => {
  const theme = useTheme();
  const { isFetching, providers, currentProvider, setCurrentProvider } =
    useProviders();
  const { currentUser } = useUser();

  const providerBottomSheetModalRef = useRef<BottomSheetModalType>(null);
  const flatListRef = useRef<FlatList>(null);

  const [scrollY, setScrollY] = useState<number>(0);

  // Open the provider bottom sheet modal
  const openProviderBottomSheetModal = useCallback(() => {
    providerBottomSheetModalRef.current?.present();
  }, []);

  // Close the provider bottom sheet modal
  const closeProviderBottomSheetModal = useCallback(() => {
    providerBottomSheetModalRef.current?.dismiss();
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const yOffset = event.nativeEvent.contentOffset.y;
      setScrollY(yOffset);
    },
    []
  );

  return (
    <>
      <FlatList
        onScroll={handleScroll}
        scrollEventThrottle={100}
        ref={flatListRef}
        contentContainerStyle={styles.contentContainer}
        data={providers}
        extraData={currentUser?.favorites}
        keyExtractor={(item) => item.provider_id}
        ListHeaderComponent={ProviderListHeader}
        ListEmptyComponent={() => {
          return (
            isFetching && (
              <ActivityIndicator size="large" color={theme.color.violet[400]} />
            )
          );
        }}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            onPress={() => {
              setCurrentProvider(item);
              openProviderBottomSheetModal();
            }}
          />
        )}
      />
      {scrollY > BACK_TO_TOP_THRESHOLD && (
        <BackToTopButton
          iconOnly={true}
          scrollRef={flatListRef}
          style={styles.backToTopButton}
          buttonStyle={styles.backToTopButtonButton}
        />
      )}
      <BottomSheetModal
        ref={providerBottomSheetModalRef}
        onDismiss={() => setCurrentProvider(null)}
      >
        {currentProvider && (
          <ProviderBottomSheetModal
            provider={currentProvider}
            onClose={() => closeProviderBottomSheetModal()}
          />
        )}
      </BottomSheetModal>
    </>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  contentContainer: {
    gap: theme.spacing[2],
    position: "relative",
  },
  backToTopButton: {
    bottom: theme.spacing[24],
    position: "absolute",
    right: theme.spacing[2],
    zIndex: 10,
  },
  backToTopButtonButton: {
    backgroundColor: theme.color.white,
    // Shadow
    shadowColor: theme.color.violet[700],
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 8,
  },
}));

const BACK_TO_TOP_THRESHOLD = 500;

export default ProviderCardList;
