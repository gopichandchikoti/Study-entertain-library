import { Plus, Search } from '../../components/icons'
import { useMemo, useState } from 'react'
import { content as copy, formatContent } from '../../content.js'
import { AlbumCard, ArtistCard, LikedCard, PlaylistCard, RadioCard } from './Cards'
import { CreatePlaylistDialog } from './MenuLayer'
import { FilterBar } from './FilterBar'
import { useMusic } from './musicContext'
import { filterTracks, keyOf, type SearchFilters } from './musicModel'
import { useMusicNav, type MusicRoute } from './musicNav'
import { TrackList } from './TrackList'

const t = copy.musicView

type Tab = 'playlists' | 'albums' | 'artists' | 'songs' | 'radios'
type Sort = 'recent' | 'name' | 'year' | 'songs'

const TABS: readonly { id: Tab; label: string }[] = [
  { id: 'playlists', label: t.scopePlaylists },
  { id: 'albums', label: t.scopeFilms },
  { id: 'artists', label: t.scopeSingers },
  { id: 'songs', label: t.scopeSongs },
  { id: 'radios', label: t.radios },
]

/** Everything in your music, with tabs for playlists, films, singers, songs and radios. */
export function LibraryPage({ route }: { route: Extract<MusicRoute, { page: 'library' }> }) {
  const music = useMusic()
  const nav = useMusicNav()
  const [tab, setTab] = useState<Tab>(route.tab ?? 'playlists')
  const [sort, setSort] = useState<Sort>('recent')
  const [text, setText] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [creating, setCreating] = useState(false)
  const needle = keyOf(text)

  const albums = useMemo(() => {
    const list = music.index.albums.filter(
      (album) => !needle || keyOf(`${album.name} ${album.artists.join(' ')} ${album.cast.join(' ')}`).includes(needle),
    )
    return sort === 'year'
      ? [...list].sort((left, right) => (right.year ?? 0) - (left.year ?? 0))
      : sort === 'songs'
        ? [...list].sort((left, right) => right.trackIds.length - left.trackIds.length)
        : sort === 'recent'
          ? [...list].sort((left, right) => right.addedAt.localeCompare(left.addedAt))
          : list
  }, [music.index.albums, needle, sort])
  const artists = useMemo(() => {
    const list = music.index.artists.filter((artist) => !needle || artist.key.includes(needle))
    return sort === 'name' ? [...list].sort((left, right) => left.name.localeCompare(right.name)) : list
  }, [music.index.artists, needle, sort])
  const playlists = music.user.playlists.filter((playlist) => !needle || keyOf(playlist.name).includes(needle))
  const sortedPlaylists = sort === 'name' ? [...playlists].sort((left, right) => left.name.localeCompare(right.name)) : playlists
  const songs = useMemo(() => {
    const list = filterTracks(music.index, filters, music.likes).filter(
      (track) => !needle || keyOf(`${track.title} ${track.artists.join(' ')} ${track.album}`).includes(needle),
    )
    return sort === 'name'
      ? [...list].sort((left, right) => left.title.localeCompare(right.title))
      : sort === 'year'
        ? [...list].sort((left, right) => (right.year ?? 0) - (left.year ?? 0))
        : list
  }, [music.index, filters, music.likes, needle, sort])

  const sorts: { id: Sort; label: string }[] = [
    { id: 'recent', label: t.sortRecent },
    { id: 'name', label: t.sortName },
    ...(tab === 'albums' || tab === 'songs' ? [{ id: 'year' as const, label: t.sortYear }] : []),
    ...(tab === 'albums' ? [{ id: 'songs' as const, label: t.sortSongs }] : []),
  ]

  return (
    <div className="music-page">
      <header className="music-section-head">
        <h1>{t.yourLibrary}</h1>
        <button className="music-pill is-primary" type="button" onClick={() => setCreating(true)}>
          <Plus size={16} />
          {t.createPlaylist}
        </button>
      </header>
      <div className="music-chips" role="tablist" aria-label={t.yourLibrary}>
        {TABS.map((entry) => (
          <button
            key={entry.id}
            className={`music-chip ${tab === entry.id ? 'is-on' : ''}`}
            type="button"
            role="tab"
            aria-selected={tab === entry.id}
            onClick={() => {
              setTab(entry.id)
              setSort('recent')
            }}
          >
            {entry.label}
          </button>
        ))}
      </div>
      {tab !== 'radios' && (
        <div className="music-library-tools">
          <label className="music-inline-search">
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">{t.filterLibrary}</span>
            <input value={text} onChange={(event) => setText(event.target.value)} placeholder={t.filterLibrary} />
          </label>
          <label className="music-sort">
            <span>{t.sortBy}</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} aria-label={t.sortBy}>
              {sorts.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {tab === 'songs' && <FilterBar filters={filters} onChange={setFilters} />}

      {tab === 'playlists' && (
        <div className="music-grid">
          <LikedCard />
          {sortedPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
          {music.user.playlists.length === 0 && <p className="music-empty-note">{t.noPlaylistsYet}</p>}
        </div>
      )}
      {tab === 'albums' && (
        <div className="music-grid">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
      {tab === 'artists' && (
        <div className="music-grid">
          {artists.map((artist) => (
            <ArtistCard key={artist.key} artist={artist} />
          ))}
        </div>
      )}
      {tab === 'songs' && (
        <>
          <p className="music-count">{formatContent(songs.length === 1 ? t.oneSong : t.manySongs, { count: songs.length })}</p>
          <TrackList tracks={songs} context={{ kind: 'library', id: null, label: t.yourLibrary }} />
        </>
      )}
      {tab === 'radios' && (
        <div className="music-grid">
          {music.user.radios.map((radio) => (
            <RadioCard
              key={radio.id}
              id={radio.id}
              label={radio.label}
              seedKind={radio.seedKind}
              seedValue={radio.seedValue}
              onRemove={() => {
                void music.deleteRadio(radio.id)
              }}
            />
          ))}
          {music.user.radios.length === 0 && <p className="music-empty-note">{t.noRadiosYet}</p>}
          {music.index.artists
            .slice(0, 4)
            .filter(
              (artist) =>
                !music.user.radios.some((radio) => radio.seedKind === 'artist' && keyOf(radio.seedValue) === artist.key),
            )
            .map((artist) => (
              <RadioCard
                key={`s:${artist.key}`}
                id={`suggested:${artist.key}`}
                label={`${artist.name} Radio`}
                seedKind="artist"
                seedValue={artist.name}
              />
            ))}
        </div>
      )}
      {creating && (
        <CreatePlaylistDialog
          onClose={() => setCreating(false)}
          onCreated={(playlist) => nav.go({ page: 'playlist', id: playlist.id })}
        />
      )}
    </div>
  )
}
