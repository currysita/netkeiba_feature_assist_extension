# netkeiba_feature_assist_extension
## これは何か
多分、一生開発中のツールです。
netkeiba.comの5柱、または9柱の情報を取り出して、値を標準化する事で各馬の特徴を相対的に表現する事を目的としています。
TSV形式で出力しますので、Excel等に貼り付けて予想に使う事ができます。
自由に修正して、自分なりの予測に役立ててください。
## 使い方
フォルダごとChromeの拡張として読み込んでください。netkeiba.comのサイトを開いたら、F12キーで開発ツールを開けば、コンソールに結果が出力されています。
## 既知の問題点
- 上がり3ハロンの値、直前のタイム、それらの標準化の値については、前走のみしか考慮していません。本来はレースの条件がより近い物を抽出すべきです。
- 各列のタイトルが変な名前になってますが、個人用に作成したので勘弁してください。
