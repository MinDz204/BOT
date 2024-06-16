function removeDuplicates(array) {
  const seen = new Set();
  return array.filter(item => {
    const duplicate = seen.has(item.url);
    seen.add(item.url);
    return !duplicate;
  });
}

const inputArray = [
  {
    title: 'Tôi yêu anh từ một ánh nhìn...Đắm - Xesi x Ricky Star (Duzme Remix) - Nhạc HOT Trend Tik Tok',
    description: 'Tôi yêu anh từ một ánh nhìn...Đắm - Xesi x Ricky Star (Duzme Remix) - Nhạc HOT Trend Tik Tok by Duzme Music',
    author: 'Duzme Music',
    url: 'https://www.youtube.com/watch?v=e1x7xoRR2JM',
    thumbnail: 'https://i.ytimg.com/vi/e1x7xoRR2JM/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhQIEUocjAP&rs=AOn4CLBA4H6IaoXZO3hYnt9u7mZKpS3frg',
    duration: '2:33',
    views: 0
  },
  {
    title: 'Tôi yêu anh từ một ánh nhìn...Đắm - Xesi x Ricky Star (Duzme Remix) - Nhạc HOT Trend Tik Tok',
    description: 'Tôi yêu anh từ một ánh nhìn...Đắm - Xesi x Ricky Star (Duzme Remix) - Nhạc HOT Trend Tik Tok by Duzme Music',
    author: 'Duzme Music',
    url: 'https://www.youtube.com/watch?v=e1x7xoRR2JM',
    thumbnail: 'https://i.ytimg.com/vi/e1x7xoRR2JM/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhQIEUocjAP&rs=AOn4CLBA4H6IaoXZO3hYnt9u7mZKpS3frg',
    duration: '2:33',
    views: 0
  },
  {
    title: 'MONO - Waiting For You (Album 22 - Track No.10)',
    description: 'MONO - Waiting For You (Album 22 - Track No.10) by Mono Official',
    author: 'Mono Official',
    url: 'https://www.youtube.com/watch?v=CHw1b_1LVBA',
    thumbnail: 'https://i.ytimg.com/vi/CHw1b_1LVBA/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARh_ICcoHzAP&rs=AOn4CLBYXXyiCCl2ZOzXqmFb7JPvmJnRWg',
    duration: '4:26',
    views: 0
  }
];

const uniqueArray = removeDuplicates(inputArray);
console.log(uniqueArray);
