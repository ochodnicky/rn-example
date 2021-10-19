import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import Colors from '../constants/Colors';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNModal from 'react-native-modal';

const Modal = props => {
  const maxModalHeight = Dimensions.get('window').height * 0.85;
  const [scrollOffset, setScrollOffset] = useState();
  const scrollRef = useRef();

  const handleOnScroll = event => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  return (
    <RNModal
      {...props}
      isVisible={props.isVisible}
      onSwipeComplete={props.onPress}
      swipeDirection={['down']}
      scrollOffset={scrollOffset}
      propagateSwipe={true}
      backdropColor={
        props.backdropColor ? props.backdropColor : Colors.Blues.darkest
      }
      backdropOpacity={props.backdropOpacity ? props.backdropOpacity : 0.7}
      onBackdropPress={props.onPress}
      avoidKeyboard={true}
      style={
        props.floating
          ? styles.floatingView
          : {
              ...styles.bottomView,
              marginBottom: props.bottomOffset ? props.bottomOffset : 0,
            }
      }
      animationIn={props.floating ? 'zoomIn' : 'slideInUp'}>
      <View
        style={
          props.floating
            ? {...styles.modal, ...styles.modalFloating, ...props.style}
            : {...styles.modal, ...props.style}
        }>
        {!props.floating ? (
          <View style={styles.modalLineWrap}>
            <View style={styles.modalLine} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.modalClose}
            onPress={props.onPress}
            hitSlop={{top: 20, bottom: 0, left: 0, right: 20}}>
            <MaterialIcons name="close" color={Colors.Greys.grey} size={20} />
          </TouchableOpacity>
        )}
        <ScrollView
          ref={scrollRef}
          onScroll={handleOnScroll}
          scrollEventThrottle={16}
          style={{...styles.modalScroll, maxHeight: maxModalHeight}}>
          <TouchableOpacity activeOpacity={1}>
            <View
              styles={styles.modalContent}
              onStartShouldSetResponder={() => true}>
              {props.children}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </RNModal>
  );
};

export default Modal;

const styles = StyleSheet.create({
  floatingView: {
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  bottomView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalLineWrap: {
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    zIndex: 10,
    top: 16,
    right: 16,
  },
  modalLine: {
    width: 149,
    height: 4,
    backgroundColor: Colors.Greys.light,
    borderRadius: 50,
    marginTop: 10,
  },
  modal: {
    backgroundColor: Colors.white,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderColor: Colors.white,
    paddingBottom: 24,
  },
  modalFloating: {
    borderRadius: 30,
  },
  modalScroll: {
    paddingHorizontal: 24,
  },
  modalContent: {},
});
