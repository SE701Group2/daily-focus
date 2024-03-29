import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import style from "./style.module.scss";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import FastForwardIcon from "@material-ui/icons/FastForward";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import PauseIcon from "@material-ui/icons/Pause";
import { accessUrl, getAuthToken, getRefreshedToken, setExpiryTime } from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();

const useStyles = makeStyles({
    root: {
        margin: "30px 20px",
        background: "#1DB954",
        borderRadius: 50,
        padding: "4px 25px",
        width: "calc(100% - 40px)",
    },
    label: {
        textTransform: "capitalize",
        fontSize: "24px",
    },
});

const CONTEXT_URI = "spotify:playlist:0vvXsWCC9xrXsKd4FyS8kM";
const SPOTIFY_TOKEN = "spotify-token";
const SPOTIFY_REFRESH_TOKEN = "spotify-refresh-token";
const SPOTIFY_TOKEN_EXPIRATION = "spotify-token-expiration";

export default function SpotifyWidget() {
    const classes = useStyles();
    const [play, setPlay] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [item, setItem] = useState(false);

    useEffect(() => {
        var _token = localStorage.getItem(SPOTIFY_TOKEN);

        if (!_token) {
            setIsLoggedIn(false);

            // the authorisation code comes from the query of page's url after the user logs in to spotify
            // check to see if the code is there. If it is, then use it get the access token
            if (window.location.search !== "") {
                getAuthToken().then((tokenData) => {
                    // store the tokens and expiry time in local storage
                    _token = tokenData.access_token;
                    const refreshToken = tokenData.refresh_token;

                    localStorage.setItem(SPOTIFY_TOKEN, _token);
                    localStorage.setItem(SPOTIFY_REFRESH_TOKEN, refreshToken);
                    setExpiryTime(tokenData.expires_in);

                    // the authorisation code is no longer needed, remove it from the URl
                    window.location.search = "";
                });
            }
        }

        if (_token) {
            var token_expiration = localStorage.getItem(SPOTIFY_TOKEN_EXPIRATION);

            // if the token is expired, try to refresh the access token
            if (token_expiration && token_expiration <= Date.now()) {
                getRefreshedToken().then((refreshData) => {
                    if (refreshData) {
                        // set the new access token
                        _token = refreshData.access_token;
                        localStorage.setItem(SPOTIFY_TOKEN, _token);
                        setExpiryTime(refreshData.expires_in);

                        onSuccessfulToken(_token);
                    } else {
                        // if the token could not be refreshed, the user needs to log in again
                        _token = null;
                        setIsLoggedIn(false);
                    }
                });
            } else {
                onSuccessfulToken(_token);
            }
        }

        const interval = setInterval(() => {
            spotify.getMyCurrentPlaybackState().then((track) => {
                setPlay(track.is_playing);
                setItem(track.item);
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    /**
     * Run after the spotify access token is confirmed to be valid
     * @param {*} token the access token
     */
    const onSuccessfulToken = (token) => {
        spotify.setAccessToken(token);
        setIsLoggedIn(true);

        spotify.getMyCurrentPlaybackState().then((track) => {
            setPlay(track.is_playing);
        });
    };

    const handlePlay = () => {
        spotify.getMyDevices().then((devices) => {
            if (play) {
                spotify.pause();
            } else {
                spotify
                    .play({
                        device_id: devices.devices[0]?.id,
                        context_uri: CONTEXT_URI,
                    })
                    .then(() => {
                        spotify.getMyCurrentPlayingTrack().then((r) => {
                            setItem(r.item);
                        });
                    });
            }
        });
    };

    const skipNext = () => {
        spotify.skipToNext().then(() => {
            spotify.getMyCurrentPlayingTrack().then((r) => {
                setItem(r.item);
                setPlay(true);
            });
        });
    };

    const skipPrevious = () => {
        spotify.skipToPrevious().then(() => {
            spotify.getMyCurrentPlayingTrack().then((r) => {
                setItem(r.item);
                setPlay(true);
            });
        });
    };

    return (
        <div className={style.spotify}>
            <div className={style.spotifyTitle}>
                <div className={style.spotifyTitleText}>Spotify</div>
            </div>
            {!isLoggedIn ? (
                <Button
                    href={accessUrl}
                    variant="contained"
                    color="primary"
                    classes={{ root: classes.root, label: classes.label }}
                >
                    Login with Spotify
                </Button>
            ) : (
                <div className={style.spotifyBody}>
                    <img
                        className={style.songImage}
                        src={item?.album?.images[0]?.url}
                        alt={item?.album?.name}
                    />
                    <div>
                        {item && (
                            <div className={style.spotifyTrackInfo}>
                                <span className={style.spotifyTrackTitle}>{item?.name}</span>
                                <span className={style.spotifyArtistName}>
                                    {item?.artists?.map((a) => a.name).join(", ")}
                                </span>
                            </div>
                        )}
                        <div>
                            <IconButton aria-label="rewind" onClick={skipPrevious}>
                                <FastRewindIcon fontSize="large" />
                            </IconButton>
                            <IconButton
                                aria-label="play"
                                onClick={() => {
                                    setPlay(!play);
                                    handlePlay();
                                }}
                            >
                                {play ? (
                                    <PauseIcon fontSize="large" />
                                ) : (
                                    <PlayArrowIcon fontSize="large" />
                                )}
                            </IconButton>
                            <IconButton aria-label="fastforward" onClick={skipNext}>
                                <FastForwardIcon fontSize="large" />
                            </IconButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
