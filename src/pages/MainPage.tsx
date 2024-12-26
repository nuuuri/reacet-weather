import { useEffect, useState } from 'react';
import { MdMenu } from 'react-icons/md';

import BookmarkButton from '@/components/BookmarkButton';
import BookmarkItem from '@/components/BookmarkItem';
import BookmarkList from '@/components/BookmarkList';
import CurrentWeather from '@/components/CurrentWeather';
import HourlyWeather from '@/components/HourlyWeather';
import Input from '@/components/Input';
import SearchList from '@/components/SearchList';

import { useDebounce } from '@/utils/useDebounce';
import { useOutsideClick } from '@/utils/useOutsideClick';

import { useBookmarkActions, useBookmarks } from '@/stores/useBookmarkStore';
import {
  useKeyItems,
  useKeyword,
  useKeywordActions,
} from '@/stores/useKeywordStore';
import {
  useCurrentRegion,
  useRegionActions,
  useSearchedRegion,
} from '@/stores/useRegionStore';

export default function MainPage() {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const currentRegion = useCurrentRegion();
  const searchedRegion = useSearchedRegion();
  const { setRegion, removeSearchedRegion } = useRegionActions();

  const bookmarks = useBookmarks();
  const { fetchBookmarks, addBookmark, removeBookmark } = useBookmarkActions();

  const keyword = useKeyword();
  const keyItems = useKeyItems();
  const { setKeyword, fetchKeyItems } = useKeywordActions();

  const debouncedKeyword = useDebounce(keyword, 200);

  const menuRef = useOutsideClick(() => {
    if (isOpenMenu && window.innerWidth < 768) {
      setIsOpenMenu(false);
    }
  });

  useEffect(() => {
    fetchKeyItems(debouncedKeyword).catch(() => {});
  }, [debouncedKeyword, fetchKeyItems]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude, latitude } = position.coords;

      setRegion(longitude, latitude).catch(() => {});
    });
  }, [setRegion]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const region = searchedRegion ?? currentRegion;

  if (!region) return <div>loading...</div>;

  return (
    <div className="flex justify-center w-screen h-screen overflow-hidden">
      {isOpenMenu && (
        <div
          ref={menuRef}
          className="absolute left-0 z-10 h-full px-5 py-10 md:relative md:w-1/5 bg-slate-300">
          <div className="relative flex gap-1 mb-5">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {keyItems.length > 0 && (
              <SearchList
                data={keyItems}
                onClickItem={(item) => {
                  setRegion(item.lon, item.lat, 'searched').catch(() => {});
                  setKeyword('');
                }}
              />
            )}
          </div>
          {currentRegion && (
            <BookmarkItem
              data={{
                ...currentRegion,
              }}
              onClick={removeSearchedRegion}>
              <p className="text-sm font-bold">현재 위치</p>
            </BookmarkItem>
          )}
          <BookmarkList
            data={bookmarks}
            onClickItem={(bookmark) => {
              setRegion(bookmark.lon, bookmark.lat, 'searched').catch(() => {});

              if (window.innerWidth < 768) {
                setIsOpenMenu(false);
              }
            }}
          />
        </div>
      )}
      <div
        className={`relative flex flex-col justify-center items-center w-4/5 gap-20 p-10 ${isOpenMenu ? 'w-4/5' : 'w-full'}`}>
        <div className="absolute flex items-center gap-4 top-5 left-5">
          <MdMenu
            className="w-8 h-8 cursor-pointer"
            onClick={() => setIsOpenMenu((state) => !state)}
          />
          {region !== currentRegion && (
            <BookmarkButton
              isChecked={
                !!bookmarks.find((bookmark) => bookmark.name === region.name)
              }
              onSelect={() => addBookmark(region)}
              onUnselect={() => removeBookmark(region.name)}
            />
          )}
        </div>

        <CurrentWeather data={region} />
        <div className="flex max-w-full gap-5 p-5 overflow-x-auto w-fit">
          {region.forecast?.map((weather, idx) => (
            <HourlyWeather key={idx} data={weather} />
          ))}
        </div>
      </div>
    </div>
  );
}
