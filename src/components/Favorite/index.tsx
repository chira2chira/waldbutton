import { Button, Icon } from "@blueprintjs/core";
import { css } from "@emotion/react";
import React, { useCallback, useContext } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { VoiceInfo } from "../../pages";
import { FavoriteContext } from "../../providers/FavoriteProvider";
import VoiceButton from "../VoiceButton";

type FavoriteProps = {
  voiceInfo: VoiceInfo[];
  onClose: () => void;
};

const Favorite: React.VFC<FavoriteProps> = (props) => {
  const { editing, favorites, setEditing, updateFavorites } =
    useContext(FavoriteContext);

  const handleEditModeChange = useCallback(() => {
    setEditing(!editing);
    if (!editing && favorites.length === 0) {
      props.onClose();
    }
  }, [editing, favorites.length, props, setEditing]);

  const handleDragStart = useCallback(() => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  }, []);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      if (!destination) {
        return;
      }
      const newFavorites = Array.from(favorites);
      const [reorderedItem] = newFavorites.splice(source.index, 1);
      newFavorites.splice(destination.index, 0, reorderedItem);
      updateFavorites(newFavorites);
    },
    [favorites, updateFavorites]
  );

  return (
    <div
      css={css`
        margin: 10px 5px;
      `}
    >
      <div
        css={css`
          text-align: right;
        `}
      >
        <Button
          icon={editing ? undefined : "edit"}
          intent={editing ? "success" : undefined}
          outlined
          onClick={handleEditModeChange}
        >
          {editing ? "終了する" : "お気に入り管理"}
        </Button>
      </div>

      <div
        css={css`
          margin: 20px 0;
        `}
      >
        {favorites.length === 0 && (
          <div>
            <p>お気に入りに追加されているボタンはありません。</p>
            <p>「お気に入り管理」より追加できます。</p>
          </div>
        )}
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId="favorite" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                css={css`
                  display: flex;
                  flex-direction: column;
                  align-items: baseline;
                  gap: 3px;
                `}
                {...provided.droppableProps}
              >
                {favorites.map((fav, i) => {
                  const voice = props.voiceInfo.find(
                    (x) => x.text === fav.text && x.id === fav.id
                  );
                  if (!voice) return null;
                  return (
                    <Draggable
                      key={voice.url}
                      draggableId={voice.url}
                      index={i}
                      isDragDisabled={!editing}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          css={css`
                            display: flex;
                          `}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {editing && (
                            <div
                              css={css`
                                display: flex;
                                align-items: center;
                                margin-left: -5px;
                                padding: 0 8px;
                              `}
                            >
                              <Icon icon="drag-handle-vertical" />
                            </div>
                          )}
                          <VoiceButton
                            voice={voice}
                            showVideoInfo={false}
                            onVideoInfoOpen={() => {}}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default React.memo(Favorite);
