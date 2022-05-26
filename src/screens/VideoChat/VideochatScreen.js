import React, {useContext, useRef, useState} from 'react';
import {View, StyleSheet, Text, Video} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {mediaDevices} from 'react-native-webrtc';
import {AppContext} from '../../Context/AppContext';
import {io} from 'socket.io-client';
// import Peer from 'simple-peer';
import config from '../../config';
const VideoC = props => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on('stream', stream => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <Video style={styles.Video} muted playsInline autoPlay ref={ref} />;
};
const VideochatScreen = ({route}) => {
  const {account, ROOM_ID} = useContext(AppContext);
  //   const {roomCode} = route.params;
  const [peers, setPeers] = useState([]);
  const socketRef = useRef(io(config.SOCKET_SERVER));
  const userVideo = useRef();
  const peersRef = useRef([]);
  const navigation = useNavigation();

  const roomID = ROOM_ID;
  const classes = useStyles();
  React.useEffect(() => {
    return () => {
      setJoinedUsers(0);
      window.location.reload(false);
    };
  }, []);

  useEffect(() => {
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind === 'videoinput' &&
          sourceInfo.facing === (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({video: videoConstraints, audio: true})
        .then(stream => {
          userVideo.current.srcObject = stream;
          socketRef.current.emit('join room', roomID);
          socketRef.current.on('all users', users => {
            const peers = [];
            users.forEach(userID => {
              const peer = createPeer(userID, socketRef.current.id, stream);
              peersRef.current.push({
                peerID: userID,
                peer,
              });
              peers.push(peer);
            });
            setPeers(peers);
          });

          socketRef.current.on('user joined', payload => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
              peerID: payload.callerID,
              peer,
            });
            setPeers(users => [...users, peer]);
          });

          socketRef.current.on('receiving returned signal', payload => {
            const item = peersRef.current.find(p => p.peerID === payload.id);
            item.peer.signal(payload.signal);
            setJoinedUsers(joinedUsers + 1);
          });
        });
    });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      socketRef.current.emit('sending signal', {
        userToSignal,
        callerID,
        wrtc: MediaStream,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      wrtc: MediaStream,
    });

    peer.on('signal', signal => {
      setJoinedUsers(joinedUsers + 1);
      socketRef.current.emit('returning signal', {signal, callerID});
    });

    peer.signal(incomingSignal);

    return peer;
  }
  // const history = useHistory()
  const [joinedUsers, setJoinedUsers] = React.useState(0);

  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      alert('User joined');
    }
  }, [show]);

  React.useEffect(() => {
    if (joinedUsers === 1) {
      setShow(true);
      const timeId = setTimeout(() => {
        setShow(false);
      }, 3000);
      return () => {
        clearTimeout(timeId);
      };
    } else {
      setShow(false);
    }
  }, [joinedUsers]);

  React.useState(() => {
    if (route.params) {
      console.log(route.params);
    } else {
      <Modals
        show={show}
        allowed={location.state.allowed}
        message="Your're not allowed!"
      />;
      navigator.navigate('Chats');
    }
  }, []);

  return (
    <>
      <View title="Video chat">
        <View>
          <View>
            <VideoC
              style={styles.Video}
              muted
              ref={userVideo}
              autoPlay
              playsInline
            />
          </View>
          <View>
            <View>{joinedUsers === 0 && <CircularProgress />}</View>
            {route.params.type === 'PRIVATE' && (
              <>
                <Text>
                  {route.params.data.caller || route.params.data.receiver}
                </Text>
                {peers[0]?.readable && <VideoC key={1} peer={peers[0]} />}
              </>
            )}
          </View>
          {route.params.type === 'PUBLIC' &&
            peers.map((peer, index) => {
              if (index === joinedUsers) {
                return peer.readable ? (
                  <View>
                    <View
                      style={{width: 'fit-content'}}
                      title={
                        route.params.data.caller || route.params.data.receiver
                      }>
                      <View>{joinedUsers === 0 && <CircularProgress />}</View>
                      <VideoC key={index} peer={peer} />
                    </View>
                  </View>
                ) : (
                  console.log('LOADING')
                );
              }
            })}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  Video: {
    height: '100%',
    width: '100%',
  },
});

export default VideochatScreen;

// title={`${account.user.first_name} ${account.user.last_name}`}
// title={location.state.callData.caller || location.state.callData.receiver}
