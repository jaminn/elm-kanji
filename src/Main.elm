module Main exposing (..)

import Browser
import Css exposing (..)
import Css.Transitions as Transition exposing (transition)
import Html.Styled exposing (..)
import Html.Styled.Attributes as Attr exposing (css, draggable, id, src)
import Html.Styled.Events exposing (onClick)
import Html.Styled.Keyed as Keyed
import Html.Styled.Lazy exposing (lazy, lazy2)
import Json.Encode as E
import Task
import Time
import UIElement exposing (toggle)



-- MAIN


main =
    Browser.element
        { init = init
        , view = view >> toUnstyled
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias ToggleModel =
    { id : Int
    , isSelected : Bool
    }


type alias Model =
    { toggleUid : Int
    , toggleList : List ToggleModel
    , isRenderReady : Bool
    }


addToggle :
    Bool
    -> { a | toggleUid : Int, toggleList : List ToggleModel }
    -> { a | toggleUid : Int, toggleList : List ToggleModel }
addToggle isSelected model =
    { model
        | toggleUid = model.toggleUid + 1
        , toggleList = model.toggleList ++ [ ToggleModel model.toggleUid isSelected ]
    }


removeLastToggle model =
    { model
        | toggleList =
            case List.reverse model.toggleList of
                _ :: tl ->
                    List.reverse tl

                [] ->
                    []
    }


clearToggle model =
    { model
        | toggleList =
            List.filter (not << .isSelected) model.toggleList
    }


init : () -> ( Model, Cmd Msg )
init _ =
    let
        toggleList =
            List.repeat 15 False |> List.indexedMap ToggleModel
    in
    ( Model (List.length toggleList) toggleList False
    , Cmd.none
    )



-- UPDATE


type Msg
    = NoOp
    | RenderReady


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        RenderReady ->
            ( { model | isRenderReady = True }, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    if model.isRenderReady then
        Sub.none

    else
        Time.every 1 (\_ -> RenderReady)



-- VIEW


floatDiv =
    node "float-div"


view : Model -> Html Msg
view model =
    div [ css [ position absolute, width (pct 100), backgroundColor (hex "#aaa") ] ]
        [ div [ css [ textAlign center, padding (px 20), backgroundColor (hex "#bbb") ] ] [ text """"사랑애"를 완성하세요!""" ]
        , div [ css [ displayFlex, justifyContent center, alignItems center, paddingTop (px 30) ] ]
            [ div [ id "box", css [ backgroundColor (hex "#fff"), width (px 300), height (px 300) ] ] []
            ]
        , div
            [ css
                [ displayFlex
                , justifyContent spaceAround
                , alignItems center
                , margin (px 30)
                , backgroundColor (hex "#777")
                , height (px 100)
                ]
            ]
            [ div [ id "a1Pos" ] [ img [ draggable "false", src "images/a1.png", css [ width (px 50), opacity (num 0.3) ] ] [] ]
            , div [ id "a2Pos" ] [ img [ draggable "false", src "images/a2.png", css [ width (px 50), opacity (num 0.3) ] ] [] ]
            , div [ id "a3Pos" ] [ img [ draggable "false", src "images/a3.png", css [ width (px 50), opacity (num 0.3) ] ] [] ]
            ]
        , div [ css [ position absolute, top zero, left zero ] ]
            [ node "drag-div"
                [ Attr.property "initTargetId" (E.string "a1Pos")
                , Attr.property "boxId" (E.string "box")
                , Attr.property "isRenderReady" (E.bool model.isRenderReady)
                , css [ position absolute ]
                ]
                [ img [ draggable "false", src "images/a1.png", css [ width (px 50) ] ] []
                ]
            , node "drag-div"
                [ Attr.property "initTargetId" (E.string "a2Pos")
                , Attr.property "boxId" (E.string "box")
                , Attr.property "isRenderReady" (E.bool model.isRenderReady)
                , css [ position absolute ]
                ]
                [ img [ draggable "false", src "images/a2.png", css [ width (px 50) ] ] []
                ]
            , node "drag-div"
                [ Attr.property "initTargetId" (E.string "a3Pos")
                , Attr.property "boxId" (E.string "box")
                , Attr.property "isRenderReady" (E.bool model.isRenderReady)
                , css [ position absolute ]
                ]
                [ img [ draggable "false", src "images/a3.png", css [ width (px 50) ] ] []
                ]
            ]
        ]
