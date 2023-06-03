import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import ReactModal from 'react-modal';

interface CardProps {
  id: string;
  action: string;
  time: number;
  heat: string;
  ingredients: string[];
  isEditable: boolean;
  onToggleEdit: () => void;
}

interface TimelineProps {
  cards: CardProps[];
}

const heatOptions = ['低', '中', '高'];
const ingredientOptions = ['菜品1', '菜品2', '菜品3', '菜品4'];

const Card: React.FC<{ card: CardProps; onDelete: (id: string) => void; onEdit: (card: CardProps) => void }> = ({
  card,
  onDelete,
  onEdit,
}) => {
  const [action, setAction] = useState(card.action);
  const [time, setTime] = useState(card.time.toString());
  const [heat, setHeat] = useState(card.heat);
  const [ingredients, setIngredients] = useState(card.ingredients.join(', '));

  useEffect(() => {
    setAction(card.action);
    setTime(card.time.toString());
    setHeat(card.heat);
    setIngredients(card.ingredients.join(', '));
  }, [card]);

  const handleSave = () => {
    onEdit({
      ...card,
      action,
      time: Number(time),
      heat,
      ingredients: ingredients.split(',').map((ingredient) => ingredient.trim()),
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mb-4 w-48 flex flex-wrap overflow-hidden">
      {card.isEditable ? (
        <>
          动作:
          <input value={action} onChange={(e) => setAction(e.target.value)} className="form-input mb-2 w-full" required />
          时间:
          <input value={time} onChange={(e) => setTime(e.target.value)} className="form-input mb-2 w-full" required />
          分钟
          火候:
          <select value={heat} onChange={(e) => setHeat(e.target.value)} className="form-select mb-2 w-full" required>
            {heatOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          菜品:
          <select value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="form-select mb-2 w-full" required>
            {ingredientOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded text-lg">
            保存
          </button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">动作:{card.action}</h2>
            <p>时间: {card.time} 分钟</p>
            <p>火候: {card.heat}</p>
            <ul>
              菜品:
              {card.ingredients.map((ingredient: string, index: React.Key) => (
                <li key={index} className="ml-4">
                  {ingredient}
                </li>
              ))}
            </ul>
            <div className="flex justify-between">
              <button onClick={card.onToggleEdit} className="bg-blue-400 text-white px-4 py-2 rounded text-lg">
                编辑
              </button>
              <button onClick={() => onDelete(card.id)} className="bg-red-500 text-white px-4 py-2 rounded text-lg">
                删除
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AddCardForm: React.FC<{ onAdd: (card: CardProps) => void }> = ({ onAdd }) => {
  const [action, setAction] = useState('');
  const [time, setTime] = useState('');
  const [heat, setHeat] = useState('');
  const [ingredients, setIngredients] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ingredientsArray = ingredients.split(',').map((ingredient) => ingredient.trim());
    const id = Date.now().toString();

    onAdd({
      id,
      action,
      time: Number(time),
      heat,
      ingredients: ingredientsArray,
      isEditable: false,
      onToggleEdit: () => {
        throw new Error('Function not implemented.');
      },
    });

    setAction('');
    setTime('');
    setHeat('');
    setIngredients('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input value={action} onChange={(e) => setAction(e.target.value)} placeholder="动作" className="form-input mb-2 w-full" required />
      <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="时间" className="form-input mb-2 w-full" required />
      <select value={heat} onChange={(e) => setHeat(e.target.value)} placeholder="火候" className="form-select mb-2 w-full" required>
        <option value="">选择火候...</option>
        {heatOptions.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
      <select value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="菜的内容（用逗号分隔）" className="form-select mb-2 w-full" required>
        <option value="">选择菜品...</option>
        {ingredientOptions.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-lg">
        添加
      </button>
    </form>
  );
};

const EditStirFry: React.FC = () => {
  const [cards, setCards] = useState<CardProps[]>([]);
  const [cards2, setCards2] = useState<CardProps[]>([]);
  const [originalCards, setOriginalCards] = useState<CardProps[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const addCard = (card: CardProps) => {
    setCards((prevCards) => [...prevCards, card]);
  };

  const deleteCard = (id: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };
  const generateNewId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const deleteCard2 = (id: string) => {
    setCards2((prevCards) => prevCards.filter((card) => card.id !== id));
  };
  
  const editCard2 = (updatedCard: CardProps) => {
    setCards2((prevCards) =>
      prevCards.map((card) => (card.id === updatedCard.id ? { ...updatedCard, isEditable: false } : card))
    );
  };

  const toggleCardEdit2 = (id: string) => {
    setCards2((prevCards) =>
      prevCards.map((card) => (card.id === id ? { ...card, isEditable: !card.isEditable } : card))
    );
  };

  const editCard = (updatedCard: CardProps) => {
    setCards((prevCards) =>
      prevCards.map((card) => (card.id === updatedCard.id ? { ...updatedCard, isEditable: false } : card))
    );
  };

  const toggleCardEdit = (id: string) => {
    setCards((prevCards) =>
      prevCards.map((card) => (card.id === id ? { ...card, isEditable: !card.isEditable } : card))
    );
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
  
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
  
    if (result.source.droppableId === 'cards2' && result.destination.droppableId === 'cards') {
      // 从cards2移动到cards
      return;
    } else if (result.source.droppableId === 'cards' && result.destination.droppableId === 'cards2') {
      // 从cards移动到cards2
      const updatedCards = Array.from(cards);
      const reorderedItem = {...updatedCards[sourceIndex]}; // 这里对元素进行了深拷贝
      reorderedItem.id = generateNewId(); // 给元素分配新的id
  
      const updatedCards2 = Array.from(cards2);
      updatedCards2.splice(destinationIndex, 0, reorderedItem);
  
      // 你可以选择不更新cards的状态，保留原始元素
      // setCards(updatedCards);
      setCards2(updatedCards2);
    }else if(result.source.droppableId ===  result.destination.droppableId){
        // 在同一个cards列表内部移动元素
        const list = result.source.droppableId === 'cards' ? cards : cards2;
        const updatedList = Array.from(list);
        const [removed] = updatedList.splice(sourceIndex, 1);
        updatedList.splice(destinationIndex, 0, removed);

        if (result.source.droppableId === 'cards') {
          setCards(updatedList);
        } else {
          setCards2(updatedList);
        }
    }
  };
  
    
  
  
  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>编辑炒菜</title>
      </Head>

      <main>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">编辑炒菜</h1>
          <button onClick={() => setModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded text-lg">
            Add New Card
          </button>
        </div>

        <ReactModal
          isOpen={isModalOpen}
          onRequestClose={() => setModalOpen(false)}
          contentLabel="Add Card Modal"
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '50%',
              height: '50%',
            },
          }}
        >
          <div className="p-4 bg-white">
            <AddCardForm
              onAdd={(card) => {
                addCard(card);
                setModalOpen(false);
              }}
            />
          </div>
        </ReactModal>
        <h1>动作库</h1>
        <br/>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="cards" direction="horizontal">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="inline-flex whitespace-nowrap -m-2 bg-gray-200 p-4">
                {cards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2">
                        <Card card={{ ...card, onToggleEdit: () => toggleCardEdit(card.id) }} onDelete={deleteCard} onEdit={editCard} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

        <br/>
        <br/>
        <br/>
        <h1>炒菜时间轴:</h1>
        <br/>
          <Droppable droppableId="cards2" direction="horizontal">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="inline-flex whitespace-nowrap -m-2 bg-gray-200 p-4">
                {cards2.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2">
                        <Card card={{ ...card, onToggleEdit: () => toggleCardEdit2(card.id) }} onDelete={deleteCard2} onEdit={editCard2} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <p className="mt-4">总时间: {cards2.reduce((total, card) => total + card.time, 0)} 分钟</p>
        <button  onClick={()=>{}} className="bg-blue-500 text-white px-4 py-2 rounded text-lg">保存菜谱</button>
      </main>

      <footer>{/* 你的页脚在这里 */}</footer>
    </div>
  );
};

export default EditStirFry;
