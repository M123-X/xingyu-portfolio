/**
 * 深渊轮回直播间 - 社交系统
 * 好友、私聊、个人主页访问
 */
const SocialSystem = {
  // 添加好友
  sendFriendRequest(playerID) {
    if (GameEngine.state.friends.find(f => f.name === playerID)) {
      GameEngine.showToast('已经是好友了');
      return;
    }
    GameEngine.state.friends.push({ name: playerID, online: Math.random() > 0.5 });
    GameEngine.saveState();
    GameEngine.showToast(`已向 ${playerID} 发送好友请求`);
  },

  // 查看他人主页
  viewProfile(playerID) {
    // 模拟查看他人主页
    GameEngine.showToast(`正在访问 ${playerID} 的个人主页...`);
    setTimeout(() => {
      GameEngine.navigateTo('profile');
    }, 500);
  },
};
