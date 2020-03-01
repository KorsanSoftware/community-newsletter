(function(window) {
  window.MainBody = class MainBody extends React.Component {
    render() {
      return e(
        'div',
        { className: 'main-body container' },
        e(Header, null),
        e(MessageList, null)
      );
    }
  };
  window.Header = class Header extends React.Component {
    render() {
      const cfLogo = e('strong', null, 'CF');
      const brand = e('div', { className: 'brand' }, cfLogo, 'Gündemi');
      const main = e('div', { className: 'top-bar' }, brand);
      return main;
    }
  };
  window.MessageItem = class MessageItem extends React.Component {
    render() {
      const reactionCounts = e(
        'small',
        null,
        `[${this.props.reactionCount}] 👍 `
      );
      const text = this.props.text.replace(this.props.link, '');
      const hasText = !!text;
      const linkTo = e('span', null, ` (${this.props.link})`);
      const linkItem = e(
        'a',
        { href: this.props.link, className: 'message-item' },
        hasText ? text : this.props.link,
        hasText ? linkTo : null
      );
      return e('li', null, reactionCounts, linkItem);
    }
  };
  window.MessageList = class MessageList extends React.Component {
    constructor(props) {
      super(props);
      this.state = { messages: [] };
    }
    render() {
      const { messages } = this.state;
      const messageItems = [];
      let content;
      messages.forEach(message => {
        messageItems.push(
          e(MessageItem, {
            reactionCount: message.reactionCount,
            text: message.text,
            link: message.links[0]
          })
        );
      });

      if (!messages.length) {
        content = e('div', { className: 'loading-spinner' }, 'Yükleniyor...');
      } else {
        content = e('ol', { className: 'data-list' }, ...messageItems);
      }
      return e('div', { className: 'content' }, content);
    }

    componentDidMount() {
      fetch('https://cf-community-news.herokuapp.com/messages')
        .then(response => response.json())
        .then(messages => this.setState({ messages }));
    }
  };
})(window);