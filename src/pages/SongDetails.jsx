import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import { setActiveSong, playPause } from '../redux/features/playerSlice';
import {
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
  useGetVideoYoutubeQuery,
} from '../redux/services/shazamCore';

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid, id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: songData, isFetching: isfetchingSongDetails } =
    useGetSongDetailsQuery({ songid });
  const {
    data,
    isfetching: isFetchingRelatedSong,
    error,
  } = useGetSongRelatedQuery({
    songid,
  });
  const songName = songData?.alias;

  const {
    data: videoData,
    isfetching: isFetchingVideo,
    error: errVideo,
  } = useGetVideoYoutubeQuery(songName);
  // console.log(videoData);
  // console.log(videoData?.actions?.type);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  if (isFetchingRelatedSong || isfetchingSongDetails)
    return <Loader title="Searching song details" />;
  if (error && errVideo) return <Error />;

  return (
    <div className="flex flex-col">
      <DetailsHeader artistId={artistId} songData={songData} />
      <div className="mb-10 ">
        <h2 className="text-white text-3xl font-bold">Details:</h2>
        <div className="mt-5 text-white">{songData?.share?.snapchat}</div>
        <div className="mt-5 text-white">{songData?.share?.subject}</div>
        <div className="mt-5 text-white">{songData?.share?.text}</div>
        {/* <ReactPlayer url={videoData.actions?.uri} /> */}
      </div>
      <RelatedSongs
        data={data}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
        artistId={artistId}
      />
    </div>
  );
};

export default SongDetails;
