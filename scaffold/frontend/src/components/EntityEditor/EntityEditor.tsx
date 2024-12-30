import EntityEditorStyles from './EntityEditorStyles.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { ButtonType } from '../Button/Button';
import { FormState, emptyFormState } from './types';
import { JsonFetch } from '@/utils/net';

import { Button, Checkbox, Flex, Input, Modal, Select } from '@/components';

export default function EntityEditor(props: {
  data: any;
  isEditedEntity: boolean;
  heading: string;
  entities: { entityName: string; filename: string; table: string }[];
}): ReturnType<React.FC> {
  const originalEntityName = useRef('');

  const [formState, setFormState] = useState<FormState>(emptyFormState);

  useEffect(() => {
    Object.keys(props.data).length > 0 ? setFormState({ ...props.data }) : null;

    let model: string = props.data.name;
    if (!!props.data.name) {
      model = props.data.name
        .split(/(?=[A-Z])/)
        .map((item: string) => item.toLowerCase())
        .join('_');
    }

    originalEntityName.current = model;
  }, [props.data]);

  const [open, setOpen] = useState<boolean>(false);

  function modalOpenSwitcherHandler() {
    setOpen((prevState) => !prevState);
  }

  const DataTypes: {
    label: string;
    value: {
      columnProperty: string;
      name: string;
    };
  }[] = [
    { label: 'varchar', value: { columnProperty: 'varchar', name: 'varchar' } },
    { label: 'text', value: { columnProperty: 'text', name: 'text' } },
    { label: 'integer', value: { columnProperty: 'integer', name: 'integer' } },
    { label: 'blob', value: { columnProperty: 'blob', name: 'blob' } },
    { label: 'double', value: { columnProperty: 'double', name: 'double' } },
    { label: 'boolean', value: { columnProperty: 'boolean', name: 'boolean' } },
    { label: 'date', value: { columnProperty: 'date', name: 'date' } },
    {
      label: 'datetime',
      value: { columnProperty: 'datetime', name: 'datetime' },
    },
  ];
  const [entityModelTxt, setEntityModelTxt] = useState<string>('');

  function checkIfFormIsValid() {
    const isValidColumns = formState.columns.every((item) => {
      return !!item.nameOfColumn;
    });

    const isValidRelationships = formState.relationships
      .slice(1, formState.relationships.length)
      .every((item) => {
        return !!item.table;
      });

    const isValidSchema =
      !!formState.name && isValidColumns && isValidRelationships;

    return isValidSchema;
  }

  const handleChange =
    (name: string, columnx: number) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (name === 'unique' || name === 'notNull' || name === 'index') {
        const { columns }: any = formState;

        columns[columnx][name] = !columns[columnx][name];
        setFormState((prevState) => ({
          ...prevState,
          ...columns,
        }));
        return;
      }

      if (name === 'name') {
        setFormState((prevState) => ({
          ...prevState,
          name: event.target.value,
        }));
        return;
      }

      const { columns }: any = formState;
      columns[columnx][name] = event.target.value;
      setFormState((prevState) => ({
        ...prevState,
        ...columns,
      }));
      checkIfFormIsValid();
    };

  const relationshipChangeHandler =
    (name: string, columnx: number) =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (name === 'type') {
        const { relationships }: any = formState;

        relationships[columnx][name] = event.target.value;
        setFormState((prevState) => ({
          ...prevState,
          ...relationships,
        }));
      }

      const { relationships }: any = formState;
      relationships[columnx][name] = event.target.value;
      setFormState((prevState) => ({
        ...prevState,
        ...relationships,
      }));
      checkIfFormIsValid();
    };

  const addColumnHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setFormState((prevState) => ({
      ...prevState,
      columns: [
        ...prevState.columns,
        {
          openSelection: false,
          nameOfColumn: '',
          datatype: 'varchar',
          notNull: true,
          unique: false,
          index: false,
        },
      ],
    }));
  };

  const dropColumnHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    column: number,
  ) => {
    e.preventDefault();
    const columnObj = formState.columns;

    if (columnObj.length > 1) {
      columnObj.splice(column, 1);
      setFormState((prevState) => ({
        ...prevState,
        column: [...columnObj],
      }));
    }
  };

  const addRelationshipHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setFormState((prevState) => ({
      ...prevState,
      relationships: [
        ...prevState.relationships,
        {
          type: 'OneToOne',
          table: '',
        },
      ],
    }));
  };

  const dropRelationshipHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    column: number,
  ) => {
    e.preventDefault();
    const { relationships } = formState;

    relationships.splice(column, 1);
    setFormState((prevState) => ({
      ...prevState,
      relationships: [...relationships],
    }));
  };

  return (
    <>
      <Flex
        width="100%"
        justifyContent="center"
        styles={{
          margin: '5em 0 1em 0',
          flex: '1 0 auto',
        }}
        alignItems="center"
        direction="column"
      >
        <h1>{props.heading}</h1>

        <Input
          placeholder={'Entity name'}
          value={formState.name}
          onChange={handleChange('name', 0)}
        />
        <form>
          {formState.columns.map((column, index) => (
            <Flex
              direction="row"
              justifyContent="center"
              alignItems="center"
              alignContent="center"
              key={index}
              styles={{ marginTop: '1em', gap: '1em', lineHeight: '2em' }}
            >
              <Input
                placeholder={'Column ' + (index + 1)}
                value={formState.columns[index].nameOfColumn}
                onChange={handleChange('nameOfColumn', index)}
                styles={{ marginRight: '1em' }}
              />

              <Select
                onChange={handleChange('datatype', index)}
                value={formState.columns[index].datatype}
                data={DataTypes}
                label={'Datatype'}
                themeColor="#b8860b"
              />
              <Flex
                direction={'row'}
                width={'25%'}
                alignItems={'center'}
                styles={{ marginTop: '2em', lineHeight: '2.5em' }}
              >
                <Checkbox
                  checked={formState.columns[index].notNull}
                  onChange={handleChange('notNull', index)}
                />
                <label style={{ marginLeft: '0.5em', width: '4em' }}>
                  Not Null
                </label>
              </Flex>
              <Flex
                direction={'row'}
                width={'25%'}
                styles={{ marginTop: '2em', lineHeight: '2.5em' }}
              >
                <Checkbox
                  checked={formState.columns[index].unique}
                  onChange={handleChange('unique', index)}
                />
                <label style={{ marginLeft: '0.5em', width: '4em' }}>
                  Unique
                </label>
              </Flex>
              <Flex
                direction={'row'}
                width={'25%'}
                styles={{ marginTop: '2em', lineHeight: '2.5em' }}
              >
                <Checkbox
                  checked={formState.columns[index].index}
                  onChange={handleChange('index', index)}
                />
                <label style={{ marginLeft: '0.5em', width: '4em' }}>
                  Index
                </label>
              </Flex>

              <Flex
                direction={'row'}
                width={'100%'}
                styles={{ marginTop: '2em', lineHeight: '3em' }}
              >
                <button
                  className={EntityEditorStyles.Button}
                  style={{
                    borderRadius: '100%',
                    lineHeight: '0em',
                    width: '1.2em',
                    height: '1.2em',
                    fontSize: '1.5em',
                    border: 'none',
                    background: 'goldenrod',
                    color: 'white',
                  }}
                  onClick={(e) => dropColumnHandler(e, index)}
                >
                  {' '}
                  <FontAwesomeIcon icon={faMinus} size="2xs" />
                </button>
              </Flex>
            </Flex>
          ))}
          <Flex
            direction={'column'}
            alignItems={'center'}
            width={'100%'}
            styles={{ marginTop: '1em', lineHeight: '2.5em' }}
          >
            <button
              className={EntityEditorStyles.Button}
              onClick={(e) => addColumnHandler(e)}
              style={{
                borderRadius: '100%',
                lineHeight: '0em',
                width: '1.2em',
                height: '1.2em',
                fontSize: '1em',
                border: 'none',
                background: 'goldenrod',
                color: 'white',
              }}
            >
              <FontAwesomeIcon icon={faPlus} size="2xs" />
            </button>
          </Flex>

          {formState.relationships.map((column, index) => (
            <Flex
              direction="row"
              justifyContent="center"
              alignItems="center"
              alignContent="center"
              key={index}
              styles={{
                margin: '0.5em auto',
                gap: '1em',
                lineHeight: '2em',
                width: '60%',
              }}
            >
              <Select
                onChange={relationshipChangeHandler('type', index)}
                value={formState.relationships[index].type}
                data={[
                  {
                    label: 'OneToOne',
                    value: {
                      name: 'OneToOne',
                    },
                  },
                  {
                    label: 'OneToMany',
                    value: {
                      name: 'OneToMany',
                    },
                  },
                  {
                    label: 'ManyToOne',
                    value: {
                      name: 'ManyToOne',
                    },
                  },
                  {
                    label: 'ManyToMany',
                    value: {
                      name: 'ManyToMany',
                    },
                  },
                ]}
                label={'Relationship type'}
                themeColor="#947119"
              />

              <Select
                onChange={relationshipChangeHandler('table', index)}
                value={formState.relationships[index].table}
                data={
                  props.entities.length > 0
                    ? [
                        {
                          label: 'No Selected Entity',
                          value: {
                            name: '',
                          },
                        },
                        ...props.entities,
                      ]
                    : [
                        {
                          label: 'No data',
                          value: {
                            name: '',
                          },
                        },
                      ]
                }
                label={'Entity name '}
                themeColor="#947119"
                styles={{ marginRight: '1em' }}
              />

              <Flex
                direction={'row'}
                width={'100%'}
                styles={{ marginTop: '2em', lineHeight: '3em' }}
              >
                <button
                  className={EntityEditorStyles.Button}
                  style={{
                    borderRadius: '100%',
                    lineHeight: '0em',
                    width: '1.2em',
                    height: '1.2em',
                    fontSize: '1.5em',
                    border: 'none',
                    background: '#947119',
                    color: 'white',
                  }}
                  onClick={(e) => dropRelationshipHandler(e, index)}
                >
                  <FontAwesomeIcon icon={faMinus} size="2xs" />
                </button>
              </Flex>
            </Flex>
          ))}

          <Flex
            direction={'column'}
            alignItems={'center'}
            width={'100%'}
            styles={{ marginTop: '1em', lineHeight: '2.5em' }}
          >
            <button
              className={EntityEditorStyles.Button}
              onClick={(e) => addRelationshipHandler(e)}
              style={{
                borderRadius: '100%',
                lineHeight: '0em',
                width: '1.2em',
                height: '1.2em',
                fontSize: '1.5em',
                border: 'none',
                background: '#947119',
                color: 'white',
              }}
            >
              <FontAwesomeIcon icon={faPlus} size="2xs" />
            </button>
          </Flex>

          <Flex
            direction={'column'}
            alignItems={'center'}
            width={'100%'}
            styles={{
              marginTop: '1em',
              lineHeight: '2.5em',
              width: '100%',
            }}
          >
            <Button
              type={ButtonType.BUTTON}
              onClick={async () => {
                if (checkIfFormIsValid()) {
                  try {
                    const response = await JsonFetch.post('entitygen', {
                      name: formState.name,
                      columns: [...formState.columns],
                      relationships: [...formState.relationships],
                      originalEntityName: originalEntityName.current,
                      isEditedEntity: props.isEditedEntity,
                    });

                    console.warn('check rel', [...formState.relationships]);
                    const responseOK = response && response.ok;
                    console.log(response, responseOK, {
                      name: formState.name,
                      columns: [...formState.columns],
                      relationships: [...formState.relationships],
                      originalEntityName: originalEntityName.current,
                      isEditedEntity: props.isEditedEntity,
                    });
                    const data = await response.json();
                    if (!responseOK) {
                      toast.error(`${data.message}'`, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: 'colored',
                        icon: false,
                      });
                      throw new Error(data.message);
                    }
                    setEntityModelTxt(data.data);
                    setOpen(true);
                    originalEntityName.current = formState.name;
                  } catch (e) {
                    console.log({ e });
                  }
                } else {
                  const MySwal = withReactContent(Swal);
                  MySwal.fire({
                    title: <strong>Entity object is not valid!</strong>,
                    html: <i>Please check form if some values is missing!</i>,
                    icon: 'warning',
                  });
                }
              }}
            >
              Preview
            </Button>
          </Flex>
        </form>
      </Flex>
      <Modal
        open={open}
        modalOpenSwitcherHandler={modalOpenSwitcherHandler}
        data={entityModelTxt}
        name={formState.name}
        onClick={async () => {
          await JsonFetch.post('entitygen/finish', {});
          modalOpenSwitcherHandler();
          toast.success(`The action was successfully performed!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
            icon: true,
          });

          if (!props.isEditedEntity) {
            setFormState({
              name: emptyFormState.name,
              originalName: emptyFormState.originalName,
              columns: [
                {
                  nameOfColumn: '',
                  datatype: 'varchar',
                  notNull: true,
                  unique: false,
                  index: false,
                },
              ],
              relationships: [
                {
                  type: 'OneToOne',
                  table: '',
                },
              ],
            });
          }
        }}
      />
    </>
  );
}
