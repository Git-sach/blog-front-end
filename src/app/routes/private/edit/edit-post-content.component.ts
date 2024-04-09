import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ContentInput, ContentInputCollection } from '../../../shared/models/contentInputCollection.model';
import { PostContentFormComponent } from '../../../shared/ui/post-content-form.component';

@Component({
  selector: 'app-edit-post-content',
  standalone: true,
  imports: [FormsModule, PostContentFormComponent, AsyncPipe],
  template: `
    <app-post-content-form
      (enterInputEmitter)="splitInputOnEnter($event)"
      (emptyInputEmmiter)="mergeInputOnBackspace($event)"
      [placeCursor]="placeCursor$ | async"
      [inputsFormContent]="inputsFormContent$ | async"
      [autofocusIndex]="autofocusIndex$ | async"></app-post-content-form>
  `,
  styles: ``,
})
export class EditPostContentComponent implements OnInit {
  @Input() set id(id: number) {}

  // local stats
  inputsFormContent$ = new BehaviorSubject<ContentInputCollection>(new ContentInputCollection());
  autofocusIndex$ = new BehaviorSubject<number>(0);
  placeCursor$ = new BehaviorSubject<number>(0);

  html =
    "<p>--TOC--</p><h1>Pourquoi un Framework ?</h1><p>L'utilisation d'un framework pour simplifier le développement d'une application suscite un grand intérêt. Un des points forts majeurs est sa capacité à gérer efficacement les mises à jour d'interfaces lorsque les données évoluent. Les frameworks sont conçus pour détecter automatiquement les modifications nécessitant une mise à jour dans le DOM, ce qui est souvent désigné comme la détection de changement.</p><p>Voici à quoi peut ressembler la simple mise à jour d'une interface suite au changement d'une valeur, sans l'utilisation d'un framwork tel que Angular 😩</p><pre><code>&lt;html&gt;  &lt;!-- Affichage de la valeur et du bouton --&gt;  &lt;div id=&quot;data&quot;&gt;&lt;/div&gt;  &lt;button id=&quot;btn&quot;&gt;Changer la valeur&lt;/button&gt;  &lt;script&gt;      let value = &quot;valeur initiale&quot;;      // Appelle à la fonction de mise à jour du template       detectChange();      // Fonction de mise à jour de la div #data       function detectChange() {        const currentValue = document.getElementById(&quot;data&quot;).innerText;        if (currentValue === value) {            document.getElementById(&quot;data&quot;).innerText = value;          }      }  // Événement au clic sur le bouton   document.getElementById(&quot;btn&quot;).addEventListener(&quot;click&quot;, () =&gt; {    value = &quot;valeur mise &agrave; jour&quot;;    // Appelle à la fonction de mise à jour du template     detectChange();     });  &lt;/script&gt;&lt;/html&gt;</code></pre><h1>Zone.js</h1><p>La détection de changements dans Angular repose sur l'utilisation d'une bibliothèque appelée <strong>Zone.js</strong>. Cette bibliothèque offre l'avantage de surveiller les opérations qui se produisent dans l'application.</p><p>Zone.js est une bibliothèque développée par l'équipe Angular, qui permet d'intercepter les opérations <strong>synchrones</strong> et <strong>asynchrones</strong>, offrant ainsi la possibilité d'exécuter du code avant et après l'événement. On parle de 'monkey patching' (retenez ce terme).</p><p>Voici une version <strong>très simplifiée</strong> de ce que permet de réaliser une zone.</p><pre><code>const oldSetTimeout = setTimeout;setTimeout = (callback, timer) => {  console.log('Avant événement');  oldSetTimeout((_) => {    callback();    console.log('Adpès événement');  }, timer);};</code></pre><p>Nous écrasons ici le comportement natif de la fonction <u>setTimeout()</u> dans le but d'ajouter des logs avant et après l'exécution du <u>setTimeout()</u>.</p><pre><code>setTimeout(() => {  console.log('Hello world');}, 1000);</code></pre><p>Lorsque nous faisons appel à notre fonction <u>setTimeout()</u> revisitée, nous obtenons en sortie notre log défini dans le <u>setTimeout()</u>, encadré par les logs ajoutés au comportement de la fonction native.</p><pre><code>Avant événementHellow worldAprès événement</code></pre><p>Avec l’utilisation de Zone.js, cela se traduit de la façon suivante :</p><pre><code>const zone = Zone.current.fork({  onInvokeTask: (delegate, current, target, task, applyThis, applyArgs) => {    console.log('Avant l'événement');    delegate.onInvokeTask(target, task, applyThis, applyArgs);    console.log('Apres l'événement')  }});</code></pre><p>Nous établissons une <strong>'zone'</strong> qui offre un contexte d'exécution <strong>persistant</strong> à travers les opérations asynchrones, résolvant ainsi une ‘faiblesse’ de JavaScript, où le contexte d'exécution d'une fonction varie en fonction de l'endroit où cette fonction est invoquée.</p><p>Pour exécuter notre <u>setTimout</u> à l’intérieur de cette zone, nous utilisons la méthode <u>zone.run()</u>.</p><pre><code>zone.run(() => {  setTimeout(() => {    console.log('Hello world');  }, 1000);})</code></pre><h1>NgZone</h1><p>Étant donné que Zone.js permet de suivre l'état des opérations synchrones et asynchrones, Angular propose un service additionnel appelé <strong>NgZone</strong>. Ce service établit une zone, exploitant ainsi les fonctionnalités de Zone.js, pour automatiser la détection des changements au sein des applications Angular.</p><img src='https://blogapi.adriencheynet.fr/image/5/graphique1.png'/><p>Mais alors, à quel moment la détection de changement est-elle déclenchée ?</p><h1>Déclenchement de la détection de changement</h1><p>En JavaSript, les opérations asynchrones peuvent être divisées en deux catégories&nbsp;: Les <strong>Micro-tasks</strong> et les <strong>Macro-tasks</strong></p><p>Les <strong>Micro-tasks</strong> : ce sont les tâches de haute priorité qui sont exécutées en premier.</p><p>Les <strong>Macro-tasks</strong> : ce sont les tâches de basse priorité qui sont exécutées après les micro-tasks.</p><img src='https://blogapi.adriencheynet.fr/image/5/tableauxMicroMacroTasck.png'/><p>Pour garantir une expérience utilisateur fluide, la détection de changement d'Angular est déclenchée une fois que la pile des Micro-tasks est vide.</p><p>NgZone met en place un <strong>Observable</strong> nommé <u>onMicrotaskEmpty</u> qui émet une valeur lorsqu’il n’y a plus de Micro-task dans la pile. Angular utilise cet Observable pour déterminer le moment propice au déclenchement de la détection de changement.</p><p>Voici une version <strong>très simplifiée</strong> du comportement de NgZone.</p><pre><code>function onEnter() {  _stack++;}function onLeave() {  _stack--;  checkStable();}function checkStable() {  if (_stack == 0) {    onMicrotaskEmpty.next(null);  }}</code></pre><p>Lorsqu'une nouvelle micro-task entre dans la pile, on incrémente. Lorsqu'une micro-task sort de la pile, on décrémente en vérifiant si la pile est vide. Si c'est le cas, on émet sur l'Observable <u>onMicrotaskEmpty</u>.</p><p>Angular souscrit à cet Observable afin d'initier la détection de changement au bon moment en utilisant la méthode <u>applicationRef.tick()</u></p><pre><code>this.zone.onMicrotaskEmpty.subscribe({  next: () => this.zone.run(() => this.applicationRef.tick())})</code></pre><h1>Propagation de la détection de changement</h1><p>Maintenant que l’on a une idée de quand et comment la détection de changement est déclenchée, explorons comment celle-ci se <strong>propage</strong> au sein de l'application.</p><p>Voici un schéma illustrant l'arborescence de notre application. Nous déclenchons un événement, tel qu'un clic sur l'un des composants.</p><img src='https://blogapi.adriencheynet.fr/image/5/graphique2.png'/><p>Une fois que l'action asynchrone est terminée, Zone.js va donc émettre une valeur sur l'Observable onMicrotaskEmpty, signalant à Angular que la détection de changement doit être exécutée.</p><p>Par défaut, lors de l'exécution de la détection de changement, Angular vérifie <strong>tous</strong> les composants de l'arbre pour déterminer si les templates doivent être mis à jour. 😲</p><img src='https://blogapi.adriencheynet.fr/image/5/graphique3.png'/><p>Ce comportement n'est pas optimisé et peut engendrer des pertes de performance si notre application comporte de nombreux composants.</p><p>Bien évidemment, Angular nous laisse la possibilité d’affiner la stratégie de détection de changement 😍</p><p>Il existe un comportement qui fait en sorte que lorsqu'un changement survient dans un composant, Angular le marque comme <strong>Dirty</strong> </p><p>Cela intervient pour deux raisons :</p><ul><li><p>La valeur de l’<u>@Input()</u> du Composant change</p></li><li><p>Un <strong>Event</strong> est généré dans le Composant (click, keydown...)</p><p>(Les Events sont aussi gérés avec du monkey patching pour rendre dirty les composants)</p></li></ul><p>Lorsqu’un composant est marqué Dirty , tous les Composants parents dans l’arborescence le sont également.</p><img src='https://blogapi.adriencheynet.fr/image/5/graphique4.png'/><p>La stratégie de détection de changement par défaut ne tire pas parti des composants marqués comme Dirty.</p><p>Pour en tirer parti, nous avons la possibilité d'indiquer à nos composants d'utiliser la stratégie <strong>OnPush</strong> dans leurs décorateurs <u>@Component()</u>.</p><pre><code>@Component({  ...  changeDetection: ChangeDetectionStrategy.OnPush,})export class MyComponent {  ...}</code></pre><p>Lorsque nous faisons cela, nous indiquons à Angular que, pour le sous-arbre de composants concernés, nous voulons exécuter la détection de changement uniquement si le composant racine du sous-arbre est marqué comme Dirty.</p><img src='https://blogapi.adriencheynet.fr/image/5/graphique5.png'/><p>En d'autres termes, les composants configurés avec la stratégie OnPush bénéficient de la détection de changement uniquement dans les cas suivants :</p><ul><li><p>Si un changement a eu lieu sur un <u>@Input()</u> du composant</p></li><li><p>Si un Event a été généré dans le composant</p></li></ul><img src='https://blogapi.adriencheynet.fr/image/5/graphique6.png'/><h1>Exemples</h1><h2>Exemple 1</h2><p>Ici, nous définissons un événement au clique sur le bouton, qui vient incrémenter un nombre.</p><pre><code>@Component({  template: `    &lt;p&gt;{{number}}&lt;/p&gt;    &lt;button (click)=&quot;onClick()&quot; &gt;&lt;/button&gt;  `,  changeDetection: ChangeDetectionStrategy.OnPush,})export class MyComponent {  number: number = 0;  onClick() {    this.number++;  }}</code></pre><p>Notre composant a pour stratégie de détection de changement OnPush.</p><p>Étant donné que nous utilisons un événement pour incrémenter notre valeur, le composant sera marqué comme Dirty, et la vue sera donc mise à jour correctement lors de l'activation de la détection de changement. 🙂</p><p></p><h2>Exemple 2</h2><p>Nous définissons ici un Observable qui émettra des valeurs de 0 jusqu’à 99 dans un composant configuré avec la stratégie de détection de changement <u>OnPush</u>.</p><p>Étant donné qu'un observable ne marque pas un composant comme Dirty lorsqu'il émet, notre vue ne sera jamais actualisée, et le compteur restera à 0. 🙁</p><pre><code>@Component({  template: `&lt;p&gt;compteur: {{number}}&lt;/p&gt;`,  changeDetection: ChangeDetectionStrategy.OnPush,})export class MyComponent {  observable = interval(1000).pipe(task(100));  number: number = 0;  this.observable.subscribe(() =&gt; {    this.number = x;  })}</code></pre><p>Nous avons plusieurs solutions pour réparer notre logique.</p><p>Nous pouvons simplement utiliser la stratégie de détection de changement par défaut qui ne se préoccupe pas de savoir si un composant est Dirty ou non.</p><p></p><h2>Exemple 3</h2><p>Nous pouvons également maintenir notre composant en mode OnPush, mais indiquer à Angular que nous voulons que, lors du prochain cycle de détection de changement, notre composant soit mis à jour.</p><p>Pour ce faire, nous utilisons la méthode <u>markForCheck()</u> de <u>ChangeDetectorRef</u>, que nous pouvons récupérer par injection de dépendance. 🙂</p><pre><code>@Component({  template: `    &lt;p&gt;{{number}}&lt;/p&gt;    &lt;button (click)=&quot;onClick()&quot; &gt;&lt;/button&gt;  `,  changeDetection: ChangeDetectionStrategy.OnPush,})export class MyComponent {  observable = interval(1000).pipe(task(100));  number: number = 0;  this.observable.subscribe(() =&gt; {    this.changeDetectorRef.markForCheck();    this.number = x;  })}</code></pre><p>Il faut cependant rester vigilant avec ce type de manipulation, car cela peut rapidement devenir très coûteux en termes de ressources.</p><p></p><h2>Exemple 4</h2><p>La troisième solution consiste à maintenir notre composant en mode <u>OnPush</u> et à utiliser dans notre vue le pipe <u>async</u> mis à disposition par Angular. 😀</p><pre><code>@Component({  template: `    &lt;p&gt;{{observable | async}}&lt;/p&gt;    &lt;button (click)=&quot;onClick()&quot;&gt;&lt;/button&gt;  `,  changeDetection: ChangeDetectionStrategy.OnPush,})export class MyComponent {  observable = interval(1000).pipe(task(100));}</code></pre><p>En réalité, le pipe <u>async</u> utilise exactement la même méthode que nous venons de voir précédemment, en appelant la méthode <u>markForCheck()</u> de <u>ChangeDetectorRef</u> lorsque l'observable émet une valeur. Ici encore, le principe de monkey patching est utilisé.</p><h1>Désactiver Zone.js</h1><p>Il est possible de désactiver NgZone de Angular.</p><p>Dans ce cas, notre application ne sera pas encapsulée dans une zone et la détection de changement devra entièrement être réalisée de façon manuelle en manipulant <u>ChangeDetectorRef()</u> et <u>ApplicationRef()</u>.</p><p>Pour désactiver NgZone, il faut indiquer dans l’objet de paramétrage fourni à bootstrapModule que nous n’utilisons pas NgZone.</p><pre><code>platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' }).catch(err => console.error(err));</code></pre><h1>En dehors de NgZone</h1><p>Sans désactiver totalement NgZone de notre application, il est possible d’exécuter du code en dehors de la zone Angular NgZone.</p><p>Cela peut être particulièrement bénéfique lorsque nous avons une logique qui s'exécute sans nécessiter de mises à jour de la vue, tel qu'un timer qui n'est pas destiné à être affiché par exemple.</p><pre><code>@Component({  template: `    &lt;p (click)=&quot;refraichView()&quot; &gt;compteur : {{number}}&lt;/p&gt;  `})export class MyComponent {  private ngZone = Injectable(NgZone);  number: number = 0;  ngOnInit() {    this.ngZone.runOutsideAngular(() => {      setInterval(() => this.number++, 100)    })  }  refraichView() {};}</code></pre><p>Dans cet exemple, nous utilisons la stratégie de détection par défaut, donc setInterval devrait normalement mettre à jour la vue. Cependant, étant donné que nous exécutons ce code en dehors de la Zone Angular, la détection des changements n'est pas déclenchée. Même si le compteur est effectivement incrémenté. 😦</p><h1>Conclusion</h1><p>La détection de changements est l'une des fonctionnalités centrales d'un framework tel qu'Angular. Elle permet de maintenir une synchronisation entre le modèle de données et l'interface utilisateur.</p><p>Pour surveiller les changements de données dans les différents composants, Angular utilise la bibliothèque Zone.js qui intercepte les opérations synchrones et asynchrones effectuées dans l'application, déclenchant ainsi la détection de changements.</p><p>En comprenant comment la détection de changements est réalisée et en utilisant des stratégies de détection de changements adaptées, nous pouvons optimiser les performances de nos applications en limitant les vérifications de changements uniquement aux cas pertinents.</p><p>L'implémentation des Signaux dans la version 17 d'Angular permet d'aller encore plus loin dans l'optimisation de la détection de changements en ciblant plus précisément les composants qui doivent être rafraîchis, et ce, en se passant de Zone.js</p><p>Mais nous parlerons plus en détail des signaux et de leurs effets sur la détection de changements dans un prochain post 😋</p>";

  ngOnInit(): void {
    // provisoire, passer par le input set id
    //TODO: Faire une methode pour passer du stringHTML au tableaux et faire la méthode inverse

    let match;
    const h1Regex = /<h1[^>]*>[\s\S]*?<\/h1>/gi;
    const pRegex = /<p[^>]*>[\s\S]*?<\/p>/gi;
    const baliseRegex = /<\/?[^>]+(>|$)/g;

    while ((match = h1Regex.exec(this.html)) !== null) {
      const currentInputs = this.inputsFormContent$.value;
      const newContentInput = new ContentInput('h1', match[0].replace(baliseRegex, ''), match.index);
      const updatedInputs = currentInputs.addContentInput(newContentInput);

      this.inputsFormContent$.next(updatedInputs);
    }

    while ((match = pRegex.exec(this.html)) !== null) {
      const currentInputs = this.inputsFormContent$.value;
      const newContentInput = new ContentInput('p', match[0].replace(baliseRegex, ''), match.index);
      const updatedInputs = currentInputs.addContentInput(newContentInput);
      this.inputsFormContent$.next(updatedInputs);
    }

    const sortedInputs = this.inputsFormContent$.value.sort();
    this.inputsFormContent$.next(sortedInputs);
  }

  /**
   * Method to split input content and create a new input after the current input with the content after the cursor.
   * and set the autofocus index to the new input
   * @param event Object containing information about the input event: indexInput, indexSelection, and inputContent.
   */
  splitInputOnEnter(event: { indexInput: number; indexSelection: number; inputContent: string }) {
    const textBeforeCursor: string = event.inputContent.substring(0, event.indexSelection);
    const textAfterCursor: string = event.inputContent.substring(event.indexSelection);

    const updatInput = new ContentInput('p', textBeforeCursor, 0);
    let updatedInputs = this.inputsFormContent$.value.updateAContentInput(event.indexInput, updatInput);

    const newInput = new ContentInput('p', textAfterCursor, 0);
    updatedInputs = updatedInputs.addContentInput(newInput, event.indexInput + 1);

    this.inputsFormContent$.next(updatedInputs);
    this.placeCursor$.next(0);
    this.autofocusIndex$.next(event.indexInput + 1);

    // TODO: Gérer la sauvegarde dans le backend
  }

  /**
   * Method that deletes an input when the cursor is at the beginning of the input on backspace action
   * Text is merged into the previous input. It then sets the autofocus index to the new input.
   * @param event Object containing information about the input event: indexInput, indexSelection, and inputContent.
   */
  mergeInputOnBackspace(event: { indexInput: number; indexSelection: number; inputContent: string }) {
    const curentInputs = this.inputsFormContent$.value;
    const cursorPosition = curentInputs.contentInputCollection[event.indexInput - 1].content.length;

    const curentContent = curentInputs.contentInputCollection[event.indexInput - 1].content;
    const updatInput = new ContentInput('p', curentContent + event.inputContent, 0);

    const updatedInputs = curentInputs
      .updateAContentInput(event.indexInput - 1, updatInput)
      .deleteContentInput(event.indexInput);

    this.inputsFormContent$.next(updatedInputs);
    this.autofocusIndex$.next(event.indexInput - 1);
    this.placeCursor$.next(cursorPosition);
  }
}
