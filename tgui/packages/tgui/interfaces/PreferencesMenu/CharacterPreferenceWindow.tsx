import { exhaustiveCheck } from "common/exhaustive";
import { useBackend, useLocalState } from "../../backend";
import { Stack, Dropdown, Flex } from "../../components";
import { Window } from "../../layouts";
import { PreferencesMenuData } from "./data";
import { PageButton } from "./PageButton";
import { AntagsPage } from "./AntagsPage";
import { JobsPage } from "./JobsPage";
import { MainPage } from "./MainPage";
import { SpeciesPage } from "./SpeciesPage";
import { QuirksPage } from "./QuirksPage";

enum Page {
  Antags,
  Main,
  Jobs,
  Species,
  Quirks,
}

const CharacterProfiles = (props: {
  activeSlot: number; // SKYRAT EDIT CHANGE
  onClick: (index: number) => void;
  profiles: (string | null)[];
}) => {
  const { profiles, activeSlot, onClick } = props;
  // SKYRAT EDIT CHANGE
  return (
    <Flex align="center" justify="center">
      <Flex.Item width="25%">
        <Dropdown
          width="100%"
          selected={activeSlot}
          displayText={profiles[activeSlot]}
          options={profiles.map((profile, slot) => ({
            value: slot,
            displayText: profile ?? 'New Character',
          }))}
          onSelected={(slot) => {
            onClick(slot);
          }}
        />
      </Flex.Item>
    </Flex>
  );
};

export const CharacterPreferenceWindow = (props, context) => {
  const { act, data } = useBackend<PreferencesMenuData>(context);

  const [currentPage, setCurrentPage] = useLocalState(context, "currentPage", Page.Main);

  let pageContents;

  switch (currentPage) {
    case Page.Antags:
      pageContents = <AntagsPage />;
      break;
    case Page.Jobs:
      pageContents = <JobsPage />;
      break;
    case Page.Main:
      pageContents = (<MainPage
        openSpecies={() => setCurrentPage(Page.Species)}
      />);

      break;
    case Page.Species:
      pageContents = (<SpeciesPage
        closeSpecies={() => setCurrentPage(Page.Main)}
      />);

      break;
    case Page.Quirks:
      pageContents = <QuirksPage />;
      break;
    default:
      exhaustiveCheck(currentPage);
  }

  return (
    <Window
      title="Character Preferences"
      width={920}
      height={770}
    >
      <Window.Content scrollable>
        <Stack vertical fill>
          <Stack.Item>
            <CharacterProfiles
              activeSlot={data.active_slot - 1}
              onClick={(slot) => {
                act("change_slot", {
                  slot: slot + 1,
                });
              }}
              profiles={data.character_profiles}
            />
          </Stack.Item>

          {!data.content_unlocked && (
            <Stack.Item align="center">
              Buy BYOND premium for more slots!
            </Stack.Item>
          )}

          <Stack.Divider />

          <Stack.Item>
            <Stack fill>
              <Stack.Item grow>
                <PageButton
                  currentPage={currentPage}
                  page={Page.Main}
                  setPage={setCurrentPage}
                  otherActivePages={[Page.Species]}
                >
                  Character
                </PageButton>
              </Stack.Item>

              <Stack.Item grow>
                <PageButton
                  currentPage={currentPage}
                  page={Page.Jobs}
                  setPage={setCurrentPage}
                >
                  {/*
                    Fun fact: This isn't "Jobs" so that it intentionally
                    catches your eyes, because it's really important!
                  */}

                  Occupations
                </PageButton>
              </Stack.Item>

              <Stack.Item grow>
                <PageButton
                  currentPage={currentPage}
                  page={Page.Antags}
                  setPage={setCurrentPage}
                >
                  Antagonists
                </PageButton>
              </Stack.Item>

              <Stack.Item grow>
                <PageButton
                  currentPage={currentPage}
                  page={Page.Quirks}
                  setPage={setCurrentPage}
                >
                  Quirks
                </PageButton>
              </Stack.Item>
            </Stack>
          </Stack.Item>

          <Stack.Divider />

          <Stack.Item>
            {pageContents}
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
